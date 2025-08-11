import { Injectable } from '@nestjs/common';

import { AccountVerificationSelectModel } from '../../3_componentes/dao/account-verification.dao';
import { OrganizationSelectModel } from '../../3_componentes/dao/organization.dao';
import { PasswordResetRequestSelectModel } from '../../3_componentes/dao/password-reset-request.dao';
import { PictureSelectModel } from '../../3_componentes/dao/pictures.dao';
import { SessionSelectModel } from '../../3_componentes/dao/session.dao';
import { TeamSelectModel } from '../../3_componentes/dao/team.dao';
import { TeamToUserSelectModel } from '../../3_componentes/dao/team-to-user.dao';
import { UserSelectModel } from '../../3_componentes/dao/user.dao';
import { JwtTokensPair } from '../../5_shared/types/interfaces/jwt-token.interface';
import { AccountVerificationDto } from './common/entities/account-verification.dto';
import { JwtTokensPairDto } from './common/entities/jwt-token.dto';
import { OrganizationDto } from './common/entities/organization.dto';
import { PasswordResetRequestDto } from './common/entities/password-reset-request.dto';
import { PictureDto } from './common/entities/picture.dto';
import { SessionDto } from './common/entities/session.dto';
import { TeamDto } from './common/entities/team.dto';
import { TeamToUserDto } from './common/entities/team-to-user.dto';
import { UserDto } from './common/entities/user.dto';

@Injectable()
export class DtoMapper {
  public mapUserDto(data: UserSelectModel): UserDto {
    return {
      id: data.id,
      status: data.status,
      verifyed: data.verifyed,
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
      expiresAt: data.expiresAt,
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

  public mapJwtTokensPairDto(data: JwtTokensPair): JwtTokensPairDto {
    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    };
  }

  public mapAccountVerificationDto(
    data: AccountVerificationSelectModel,
  ): AccountVerificationDto {
    return {
      id: data.id,
      userId: data.userId,
      code: data.code,
      expiresAt: data.expiresAt,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}
