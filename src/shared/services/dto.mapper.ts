import { Injectable } from '@nestjs/common';

import { OrganizationSelectModel } from '../dao/organization.dao';
import { PasswordResetRequestSelectModel } from '../dao/password-reset-request.dao';
import { PictureSelectModel } from '../dao/pictures.dao';
import { SessionSelectModel } from '../dao/session.dao';
import { TeamSelectModel } from '../dao/team.dao';
import { TeamToUserSelectModel } from '../dao/team-to-user.dao';
import { UserSelectModel } from '../dao/user.dao';
import { JwtTokensPairDto } from '../dto/entities/jwt-token.dto';
import { OrganizationDto } from '../dto/entities/organization.dto';
import { PasswordResetRequestDto } from '../dto/entities/password-reset-request.dto';
import { PictureDto } from '../dto/entities/picture.dto';
import { SessionDto } from '../dto/entities/session.dto';
import { TeamDto } from '../dto/entities/team.dto';
import { TeamToUserDto } from '../dto/entities/team-to-user.dto';
import { UserDto } from '../dto/entities/user.dto';
import { JwtTokensPair } from '../interfaces/jwt-token.interface';

@Injectable()
export class DtoMapper {
  public mapUserDto(data: UserSelectModel): UserDto {
    return {
      id: data.id,
      status: data.status,
      username: data.username,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      phoneNumber: data.phoneNumber,
      picture: data.picture,
      recoveryEmailAddress: data.recoveryEmailAddress,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  public mapTeamDto(data: TeamSelectModel): TeamDto {
    return {
      id: data.id,
      status: data.status,
      name: data.name,
      picture: data.picture,
      pictureId: data.pictureId,
      isDefault: data.isDefault,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  public mapTeamToUserDto(data: TeamToUserSelectModel): TeamToUserDto {
    return {
      userId: data.userId,
      teamId: data.teamId,
      team: data.team,
      role: data.role,
      isFavorite: data.isFavorite,
      isDefault: data.isDefault,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  public mapSessionDto(data: SessionSelectModel): SessionDto {
    return {
      id: data.id,
      userId: data.userId,
      token: data.token,
      name: data.name,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  public mapPictureDto(data: PictureSelectModel): PictureDto {
    return {
      id: data.id,
      picture: data.picture,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  public mapPasswordResetRequestDto(
    data: PasswordResetRequestSelectModel,
  ): PasswordResetRequestDto {
    return {
      id: data.id,
      userId: data.userId,
      code: data.code,
      expiresIn: data.expiresIn,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  public mapOrganizationDto(data: OrganizationSelectModel): OrganizationDto {
    return {
      id: data.id,
      status: data.status,
      name: data.name,
      slug: data.slug,
      pictureId: data.pictureId,
      picture: data.picture,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  public mapJwtDto(data: JwtTokensPair): JwtTokensPairDto {
    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    };
  }
}
