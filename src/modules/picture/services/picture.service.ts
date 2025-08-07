import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { MultipartFile } from '@fastify/multipart';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { pipeline } from 'stream';
import { promisify } from 'util';

import { EnvConfig } from '../../../shared/config/configuration';
import {
  PictureDao,
  PictureSelectModel,
} from '../../../shared/dao/pictures.dao';
import { UserDao } from '../../../shared/dao/user.dao';
import { GetPictureResponseBodyDto } from '../../../shared/dto/controllers/auth/response-body.dto';

@Injectable()
export class PictureService {
  private readonly streamPipeline = promisify(pipeline);

  private readonly client: S3Client;

  private endpoint: string;
  private region: string;
  private accessKeyId: string;
  private secretAccessKey: string;

  constructor(
    private readonly pictureDao: PictureDao,
    private readonly userDao: UserDao,
    private readonly configService: ConfigService<EnvConfig>,
  ) {
    this.endpoint = this.configService.getOrThrow('S3_ENDPOINT');
    this.region = this.configService.getOrThrow('S3_REGION');
    this.accessKeyId = this.configService.getOrThrow('S3_ACCESS_KEY_ID');
    this.secretAccessKey = this.configService.getOrThrow(
      'S3_SECRET_ACCESS_KEY',
    );

    this.client = new S3Client({
      endpoint: this.endpoint,
      region: this.region,
      forcePathStyle: true,
      credentials: {
        accessKeyId: this.accessKeyId,
        secretAccessKey: this.secretAccessKey,
      },
    });
  }

  /**
   * Upload picture
   * 1. Create new picture record
   * 2. Set user pictureId
   * 3. Delete old s3 file and picture record if exists
   * 4. Push image to s3
   *
   * @returns PictureSelectModel
   */
  async uploadPicture({
    file,
    bucket,
    userId,
  }: {
    file: MultipartFile;
    bucket: string;
    userId: string;
  }): Promise<PictureSelectModel> {
    const user = await this.userDao.findById({ id: userId });

    const oldPictureId = user.pictureId;

    // 1. Create new picture record
    const picture = await this.pictureDao.create({
      data: {
        picture: file.filename,
      },
    });

    // 2. Set user pictureId
    await this.userDao.update({
      data: { pictureId: picture.id },
      id: userId,
    });

    // 3. Delete old s3 object and picture record if exists
    if (oldPictureId !== null) {
      await this.client.send(
        new DeleteObjectCommand({ Bucket: bucket, Key: oldPictureId }),
      );

      await this.pictureDao.delete({ id: oldPictureId });
    }

    // 4. Push image to s3
    const buffer = await file.toBuffer();
    await this.client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: picture.id,
        Body: buffer,
        ContentType: file.mimetype,
      }),
    );

    return picture;
  }

  /**
   * Get picture
   * 1. Check if picture exist
   * 2. Make url to picture
   *
   * @returns url to picture
   */
  public async getPicture({
    bucket,
    pictureId,
  }: {
    bucket: string;
    pictureId: string;
  }): Promise<GetPictureResponseBodyDto> {
    // 1. Check if picture exist
    const pictureCandidate = await this.pictureDao.findById({ id: pictureId });

    if (!pictureCandidate) {
      throw new BadRequestException('Picture not found');
    }

    // 2. Make url to picture
    const url = await getSignedUrl(
      this.client,
      new GetObjectCommand({
        Bucket: bucket,
        Key: pictureId,
      }),
      { expiresIn: 3600 },
    );
    return { url };
  }

  /**
   * Upload picture
   * 1. Check if user hace picture
   * 2. Set user pictureId to null
   * 3. Delete s3 file and picture record
   */
  public async deletePicture({
    bucket,
    userId,
  }: {
    bucket: string;
    userId: string;
  }): Promise<void> {
    // 1. Check if user hace picture
    const user = await this.userDao.findById({ id: userId });
    if (!user.pictureId) {
      throw new BadRequestException('User do not have picture');
    }

    const pictureId = user.pictureId;

    // 2. Set user pictureId to null
    await this.userDao.update({ data: { pictureId: null }, id: userId });

    // 3. Delete s3 file and picture record
    await this.client.send(
      new DeleteObjectCommand({ Bucket: bucket, Key: pictureId }),
    );
    await this.pictureDao.delete({ id: pictureId });
  }
}
