import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBasicAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';

import { APP_DEFAULT_V1_PREFIX } from '../../shared/const/app.const';
import { SWAGGER_TAGS } from '../../shared/const/swagger.const';
import { GetUserFromRequest } from '../../shared/decorators/get-user-from-request.decorator';
import { JwtAccessGuard } from '../../shared/guards/auth.guard';
import { JwtTokenPayload } from '../../shared/interfaces/jwt-token.interface';
import { S3Service } from './services/s3.service';

@ApiTags(SWAGGER_TAGS.s3.title)
@Controller(`${APP_DEFAULT_V1_PREFIX}/s3`)
export class S3Controller {
  private readonly bucket: string;
  constructor(private readonly s3Service: S3Service) {
    this.bucket = 'picture';
  }

  @ApiOperation({ summary: 'Upload PNG file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiBasicAuth('Bearer')
  @UseGuards(JwtAccessGuard)
  @Post()
  async uploadPicture(
    @Req() req: FastifyRequest,
    @GetUserFromRequest() user: JwtTokenPayload,
  ): Promise<{ message: string }> {
    const file = await req.file();
    if (!file) {
      throw new BadRequestException();
    }

    await this.s3Service.uploadPicture({
      file,
      bucket: this.bucket,
      id: user.id,
    });
    return { message: 'Uploaded' };
  }

  @ApiBasicAuth('Bearer')
  @UseGuards(JwtAccessGuard)
  @Get()
  async getPicture(
    @GetUserFromRequest() user: JwtTokenPayload,
  ): Promise<{ url: string }> {
    return await this.s3Service.getPicture({
      bucket: this.bucket,
      userId: user.id,
    });
  }

  @ApiBasicAuth('Bearer')
  @UseGuards(JwtAccessGuard)
  @Delete()
  async deletePicture(
    @GetUserFromRequest() user: JwtTokenPayload,
  ): Promise<{ message: string }> {
    await this.s3Service.deletePicture({
      bucket: this.bucket,
      userId: user.id,
    });

    return { message: 'picture succesfuly deleted' };
  }
}
