import { ApiProperty } from '@nestjs/swagger';

export class PaginationQueryDto {
  @ApiProperty({
    description: 'Page',
    type: String,
    example: Number,
  })
  page!: number;

  @ApiProperty({
    description: 'Page size',
    type: String,
    example: Number,
  })
  size!: number;
}
