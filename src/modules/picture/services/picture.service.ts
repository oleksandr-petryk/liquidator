import { MultipartFile } from '@fastify/multipart';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { pipeline } from 'stream';
import { promisify } from 'util';

import {
  PictureDao,
  PictureSelectModel,
} from '../../../shared/dao/pictures.dao';
import { UserDao } from '../../../shared/dao/user.dao';
import { GetPictureResponseBodyDto } from '../../../shared/dto/controllers/auth/response-body.dto';
import { S3Service } from '../../s3/services/s3.service';

@Injectable()
export class PictureService extends S3Service {
  private readonly streamPipeline = promisify(pipeline);

  constructor(
    protected readonly configService: ConfigService,
    private readonly pictureDao: PictureDao,
    private readonly userDao: UserDao,
  ) {
    super(configService);
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
      await this.delete({ bucket: bucket, key: oldPictureId });

      await this.pictureDao.delete({ id: oldPictureId });
    }

    // 4. Push image to s3
    const buffer = await file.toBuffer();
    this.upload({
      bucket: bucket,
      key: picture.id,
      body: buffer,
      contentType: file.mimetype,
    });

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
    const url = await this.getUrl({
      bucket: bucket,
      key: pictureId,
    });

    return { url };
  }

  /**
   * Upload picture
   * 1. Check if user hace picture
   * 2. Set user pictureId to null
   * 3. Delete picture record
   * 4. Delete s3 file
   */
  public async deletePicture({
    bucket,
    userId,
  }: {
    bucket: string;
    userId: string;
  }): Promise<void> {
    // 1. Check if user have picture
    const user = await this.userDao.findById({ id: userId });
    if (!user.pictureId) {
      throw new BadRequestException('User do not have picture');
    }

    const pictureId = user.pictureId;

    // 2. Set user pictureId to null
    await this.userDao.update({ data: { pictureId: null }, id: userId });

    // 3. Delete picture record
    await this.pictureDao.delete({ id: pictureId });

    // 4. Delete s3 file
    this.delete({ bucket: bucket, key: pictureId });
  }
}
