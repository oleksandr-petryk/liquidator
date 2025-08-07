import type { SwaggerTags } from '../types/swagger.type';

export const SWAGGER_TAGS = {
  platform: {
    title: 'Platform',
    description: 'Basic platform endpoints',
  },
  auth: {
    title: 'Auth',
  },
  picture: {
    title: 'Picture',
  },
} satisfies SwaggerTags;
