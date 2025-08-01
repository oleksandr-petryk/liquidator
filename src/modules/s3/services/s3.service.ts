import {
  CreateBucketCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  ListBucketsCommand,
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
export class S3Service {
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

  private async createBucket(bucket: string): Promise<void> {
    if (
      !(await this.client.send(new ListBucketsCommand({}))).Buckets?.some(
        (b) => {
          if (b.Name === bucket) {
            return true;
          }
        },
      )
    ) {
      await this.client.send(new CreateBucketCommand({ Bucket: bucket }));
    }
  }

  async uploadPicture({
    file,
    bucket,
    id,
  }: {
    file: MultipartFile;
    bucket: string;
    id: string;
  }): Promise<void> {
    await this.createBucket(bucket);

    const picture = await this.pictureDao.create({
      data: {
        picture: file.filename,
      },
    });

    await this.userDao.update({ data: { pictureId: picture.id }, id });

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
    id,
  }: {
    bucket: string;
    id: string;
  }): Promise<{ url: string }> {
    const user = await this.userDao.findById({ id });

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
    key,
  }: {
    bucket: string;
    key: string;
  }): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({ Bucket: bucket, Key: key }),
    );
  }
}
