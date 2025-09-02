import { SwaggerTags } from '../../types/swagger.type';

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
  mail: {
    title: 'Mail',
  },
  user: {
    title: 'User',
  },
  organization: {
    title: 'Organization',
  },
} satisfies SwaggerTags;
