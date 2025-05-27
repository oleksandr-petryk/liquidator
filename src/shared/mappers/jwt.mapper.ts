import { JwtTokensPairDto } from '../dto/entities/jwt-token.dto';
import type { JwtTokensPair } from '../interfaces/jwt-token.interface';
import type { SerializeMapper } from '../interfaces/mapper.interface';

export const JwtTokensPairMapper: SerializeMapper<
  JwtTokensPair,
  JwtTokensPairDto
> = {
  serialize: function (deserialized) {
    return new JwtTokensPairDto({
      accessToken: deserialized.accessToken,
      refreshToken: deserialized.refreshToken,
    });
  },
};
