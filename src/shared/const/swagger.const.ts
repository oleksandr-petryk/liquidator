import type { SwaggerTags } from '../types/swagger.type';

export const SWAGGER_TAGS = {
  platform: {
    title: 'Platform',
    description: 'Basic platform endpoints',
  },
  auth: {
    title: 'Auth',
  },
  mail: {
    title: 'Mail',
  },
} satisfies SwaggerTags;
