import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CreateOrganizationRequestBodyDto {
  @ApiProperty({
    description: 'Organization name',
    type: String,
    example: 'Li',
    maxLength: 30,
  })
  @IsString()
  @MaxLength(30)
  name!: string;

  @ApiProperty({
    description: 'Organization slug',
    type: String,
    example: 'li',
    maxLength: 30,
  })
  @IsString()
  @MaxLength(30)
  slug!: string;
}
