import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import {
  ApiExcludeEndpoint,
  ApiExtraModels,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import {
  ReferenceObject,
  SchemaObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

import type { AbstractResponseDto } from '../dto/common/abstract-response.dto';
import { PageablePayloadDto } from '../dto/common/pageable-payload.dto';

type AbstractProps<DataDto> = keyof AbstractResponseDto<DataDto>;
type PageableProps<DataDto> = keyof PageablePayloadDto<DataDto>;
type Schema = ReferenceObject | SchemaObject;

interface Class {
  constructor: {
    name: string;
  };
}

export interface ApiResponse<DataDto extends Class> {
  payload: DataDto;
  payloadType: DataDto['constructor']['name'];
}

export const ApiAbstractResponse = <DataDto extends Type<unknown>>(
  dataDto: DataDto,
  config?: {
    pageable?: boolean;
    exclude?: boolean;
    isArray?: boolean;
    status?: HttpStatus;
  },
): ReturnType<typeof applyDecorators> => {
  const decorators: MethodDecorator[] = [ApiExtraModels(dataDto)];

  let properties: Record<AbstractProps<DataDto>, Schema>;
  let payloadType: string;

  if (config?.pageable) {
    payloadType = `${PageablePayloadDto.name}<${dataDto.name}>`;
    properties = {
      payload: {
        type: 'object',
        properties: {
          items: {
            type: 'array',
            items: { $ref: getSchemaPath(dataDto) },
          },
          count: {
            type: 'number',
          },
        } as Record<PageableProps<DataDto>, Schema>,
      },
    };
  } else {
    payloadType = dataDto.name;
    properties = {
      payload: config?.isArray
        ? {
            type: 'array',
            items: { $ref: getSchemaPath(dataDto) },
            payloadType: {
              type: 'string',
              description: 'Type of response payload',
              enum: [payloadType],
            },
          }
        : {
            $ref: getSchemaPath(dataDto),
          },
    } as Record<AbstractProps<DataDto>, Schema>;
  }

  if (config?.exclude) {
    decorators.push(ApiExcludeEndpoint());
  }

  decorators.push(
    ApiResponse({
      status: config?.status || HttpStatus.OK,
      schema: {
        required: [],
        properties,
      },
    }),
  );

  return applyDecorators(...decorators);
};
