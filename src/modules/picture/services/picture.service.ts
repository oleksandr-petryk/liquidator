import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { MultipartFile } from '@fastify/multipart';
import { BadRequestException, Injectable } from '@nestjs/common';
import { pipeline } from 'stream';
import { promisify } from 'util';

import { PictureDao } from '../../../shared/dao/pictures.dao';
import { UserDao } from '../../../shared/dao/user.dao';

@Injectable()
export class PictureService {
  private readonly streamPipeline = promisify(pipeline);

  private readonly client: S3Client;

  constructor(
    private readonly pictureDao: PictureDao,
    private readonly userDao: UserDao,
  ) {
    this.client = new S3Client({
      endpoint: 'http://localhost:4566',
      region: 'us-east-1',
      forcePathStyle: true,
      credentials: {
        accessKeyId: 'test', // todo
        secretAccessKey: 'test', // too todo
      },
    });
  }

  async uploadPicture({
    file,
    bucket,
    userId,
  }: {
    file: MultipartFile;
    bucket: string;
    userId: string;
  }): Promise<void> {
    const user = await this.userDao.findById({ id: userId });

    if (
      user.pictureId &&
      (await this.userDao.findManyByPictureId({ pictureId: user.pictureId }))
        .length < 2
    ) {
      await this.client.send(
        new DeleteObjectCommand({ Bucket: bucket, Key: user.pictureId }),
      );
    }

    const picture = await this.pictureDao.create({
      data: {
        picture: file.filename,
      },
    });

    await this.userDao.update({ data: { pictureId: picture.id }, id: userId });

    const buffer = await file.toBuffer();

    await this.client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: picture.id,
        Body: buffer,
        ContentType: file.mimetype,
      }),
    );
  }

  public async getPicture({
    bucket,
    userId,
  }: {
    bucket: string;
    userId: string;
  }): Promise<{ url: string }> {
    const user = await this.userDao.findById({ id: userId });

    if (!user.pictureId) {
      throw new BadRequestException('User dont have picture');
    }

    const url = await getSignedUrl(
      this.client,
      new GetObjectCommand({
        Bucket: bucket,
        Key: user.pictureId,
      }),
      { expiresIn: 3600 },
    );
    return { url };
  }

  public async deletePicture({
    bucket,
    userId,
  }: {
    bucket: string;
    userId: string;
  }): Promise<void> {
    const user = await this.userDao.findById({ id: userId });

    if (!user.pictureId) {
      throw new BadRequestException('User already dont have picture');
    }

    if (
      (await this.userDao.findManyByPictureId({ pictureId: user.pictureId }))
        .length < 2
    ) {
      await this.client.send(
        new DeleteObjectCommand({ Bucket: bucket, Key: user.pictureId }),
      );
    }

    await this.userDao.update({ data: { pictureId: null }, id: userId });
  }
}
