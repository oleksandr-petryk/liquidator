import { Injectable } from '@nestjs/common';

import { AccountVerificationSelectModel } from '../../3_components/dao/account-verification.dao';
import { ClientFingerprintSelectModel } from '../../3_components/dao/client-fingerprint.dao';
import { OrganizationSelectModel } from '../../3_components/dao/organization.dao';
import { PasswordResetRequestSelectModel } from '../../3_components/dao/password-reset-request.dao';
import { PictureSelectModel } from '../../3_components/dao/pictures.dao';
import { SessionSelectModel } from '../../3_components/dao/session.dao';
import { TeamSelectModel } from '../../3_components/dao/team.dao';
import { TeamToUserSelectModel } from '../../3_components/dao/team-to-user.dao';
import { UserSelectModel } from '../../3_components/dao/user.dao';
import { JwtTokensPair } from '../../5_shared/interfaces/jwt-token.interface';
import { AccountVerificationDto } from './entities/account-verification.dto';
import { ClientFingerprintDto } from './entities/client-fingerprint.dto';
import { JwtTokensPairDto } from './entities/jwt-token.dto';
import { OrganizationDto } from './entities/organization.dto';
import { PasswordResetRequestDto } from './entities/password-reset-request.dto';
import { PictureDto } from './entities/picture.dto';
import { SessionDto } from './entities/session.dto';
import { TeamDto } from './entities/team.dto';
import { TeamToUserDto } from './entities/team-to-user.dto';
import { UserDto } from './entities/user.dto';

@Injectable()
export class DtoMapper {
  public mapUserDto(
    data: Omit<UserSelectModel, 'status' | 'password'>,
  ): Omit<UserDto, 'status'> {
    return {
      id: data.id,
      verified: data.verified,
      username: data.username,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      phoneNumber: data.phoneNumber,
      pictureId: data.pictureId,
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

  public mapSessionDto(
    data: SessionSelectModel & { thisDevice?: boolean },
  ): SessionDto {
    return {
      id: data.id,
      userId: data.userId,
      clientFingerprintId: data.clientFingerprintId,
      name: data.name,
      thisDevice: data.thisDevice,
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

  public mapClientFingerprintDto(
    data: ClientFingerprintSelectModel,
  ): ClientFingerprintDto {
    return {
      id: data.id,
      userAgent: data.userAgent,
      ip: data.ip,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}
