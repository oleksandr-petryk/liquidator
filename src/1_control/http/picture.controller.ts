import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
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
import { UUID } from 'crypto';
import { FastifyRequest } from 'fastify';

import { PictureService } from '../../2_service/picture/picture.service';
import { PictureSelectModel } from '../../3_componentes/dao/pictures.dao';
import { APP_DEFAULT_V1_PREFIX } from '../../5_shared/config/const/app.const';
import { SWAGGER_TAGS } from '../../5_shared/config/const/swagger.const';
import { ApiAbstractResponse } from '../../5_shared/decorators/api-abstract-response.decorator';
import { GetUserFromRequest } from '../../5_shared/decorators/get-user-from-request.decorator';
import { JwtAccessGuard } from '../../5_shared/guards/auth.guard';
import { JwtTokenPayload } from '../../5_shared/types/interfaces/jwt-token.interface';
import { PictureDto } from '../../6_model/dto/common/entities/picture.dto';
import { GetPictureResponseBodyDto } from '../../6_model/dto/common/io/auth/response-body.dto';

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
  @ApiAbstractResponse(PictureDto)
  @UseGuards(JwtAccessGuard)
  @Post()
  async uploadPicture(
    @Req() req: FastifyRequest,
    @GetUserFromRequest() user: JwtTokenPayload,
  ): Promise<PictureSelectModel> {
    const file = await req.file();
    if (!file) {
      throw new BadRequestException();
    }

    return await this.pictureService.uploadPicture({
      file,
      bucket: this.bucket,
      userId: user.id,
    });
  }

  @ApiOperation({ summary: 'Get picture' })
  @ApiAbstractResponse(GetPictureResponseBodyDto)
  @Get(':pictureId')
  async getPicture(
    @Param('pictureId') pictureId: UUID,
  ): Promise<{ url: string }> {
    return await this.pictureService.getPicture({
      bucket: this.bucket,
      pictureId: pictureId,
    });
  }

  @ApiOperation({ summary: 'Delete picture' })
  @ApiBasicAuth('Bearer')
  @UseGuards(JwtAccessGuard)
  @Delete()
  async deletePicture(
    @GetUserFromRequest() user: JwtTokenPayload,
  ): Promise<void> {
    await this.pictureService.deletePicture({
      bucket: this.bucket,
      userId: user.id,
    });
  }
}
