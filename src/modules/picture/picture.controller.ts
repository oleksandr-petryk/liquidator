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
import { PictureService } from './services/picture.service';

@ApiTags(SWAGGER_TAGS.picture.title)
@Controller(`${APP_DEFAULT_V1_PREFIX}/picture`)
export class PictureController {
  private readonly bucket: string;
  constructor(private readonly pictureService: PictureService) {
    this.bucket = 'pictures';
  }

  @ApiOperation({ summary: 'Upload picture' })
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

    await this.pictureService.uploadPicture({
      file,
      bucket: this.bucket,
      userId: user.id,
    });
    return { message: 'Uploaded' };
  }

  @ApiOperation({ summary: 'Get picture' })
  @ApiBasicAuth('Bearer')
  @UseGuards(JwtAccessGuard)
  @Get()
  async getPicture(
    @GetUserFromRequest() user: JwtTokenPayload,
  ): Promise<{ url: string }> {
    return await this.pictureService.getPicture({
      bucket: this.bucket,
      userId: user.id,
    });
  }

  @ApiOperation({ summary: 'Delete picture' })
  @ApiBasicAuth('Bearer')
  @UseGuards(JwtAccessGuard)
  @Delete()
  async deletePicture(
    @GetUserFromRequest() user: JwtTokenPayload,
  ): Promise<{ message: string }> {
    await this.pictureService.deletePicture({
      bucket: this.bucket,
      userId: user.id,
    });

    return { message: 'picture succesfuly deleted' };
  }
}
