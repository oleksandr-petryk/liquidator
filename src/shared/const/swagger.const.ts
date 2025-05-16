type SwaggerTags = Record<
  string,
  {
    title: string;
    description?: string;
  }
>;

export const SWAGGER_TAGS = {
  platform: {
    title: 'Platform',
    description: 'Basic platform endpoints',
  },
  auth: {
    title: 'Auth',
  },
} satisfies SwaggerTags;
