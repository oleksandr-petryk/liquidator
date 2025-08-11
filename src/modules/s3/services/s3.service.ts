import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { EnvConfig } from '../../../shared/config/configuration';

@Injectable()
export class S3Service {
  private readonly client: S3Client;

  private endpoint: string;
  private region: string;
  private accessKeyId: string;
  private secretAccessKey: string;

  constructor(protected readonly configService: ConfigService<EnvConfig>) {
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

  public async getUrl({
    bucket,
    key,
    expiresAt = 3600,
  }: {
    bucket: string;
    key: string;
    expiresAt?: number;
  }): Promise<string> {
    return await getSignedUrl(
      this.client,
      new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      }),
      { expiresIn: expiresAt },
    );
  }

  public async delete({
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

  public async upload({
    bucket,
    key,
    body,
    contentType,
  }: {
    bucket: string;
    key: string;
    body: any;
    contentType: string;
  }): Promise<void> {
    await this.client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
      }),
    );
  }
}
