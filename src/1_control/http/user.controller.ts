import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBasicAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PinoLogger } from 'nestjs-pino';

import { UserDao } from '../../3_componentes/dao/user.dao';
import { APP_DEFAULT_V1_PREFIX } from '../../5_shared/config/const/app.const';
import { SWAGGER_TAGS } from '../../5_shared/config/const/swagger.const';
import { ApiAbstractResponse } from '../../5_shared/decorators/api-abstract-response.decorator';
import { GetUserFromRequest } from '../../5_shared/decorators/get-user-from-request.decorator';
import { JwtAccessGuard } from '../../5_shared/guards/auth.guard';
import { JwtTokenPayload } from '../../5_shared/interfaces/jwt-token.interface';
import { DtoMapper } from '../../6_model/dto/dto.mapper';
import { GetUserResponseBodyDto } from '../../6_model/dto/io/auth/response-body.dto';

@ApiTags(SWAGGER_TAGS.user.title)
@Controller(`${APP_DEFAULT_V1_PREFIX}/user`)
export class UserController {
  constructor(
    private readonly logger: PinoLogger,
    private readonly userDao: UserDao,
    private readonly dtoMapper: DtoMapper,
  ) {}

  @ApiOperation({
    summary: 'Get user information',
  })
  @ApiAbstractResponse(GetUserResponseBodyDto)
  @ApiBasicAuth('Bearer')
  @UseGuards(JwtAccessGuard)
  @Get()
  async getUser(
    @GetUserFromRequest() user: JwtTokenPayload,
  ): Promise<GetUserResponseBodyDto> {
    this.logger.info(`${this.getUser.name}, user: ${JSON.stringify(user)}`);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, status, ...userInfo } = await this.userDao.findById({
      id: user.id,
    });

    return this.dtoMapper.mapUserDto(userInfo);
  }
}
