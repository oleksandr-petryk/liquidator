import { UserProperties } from '../../types/user.type';

export const USER_PROPERTIES: Record<string, UserProperties> = {
  email: {
    description: 'User email',
    type: String,
    example: 'example@gmail.com',
    maxLength: 320,
    minLength: 5,
  },

  username: {
    description: 'Username of user',
    type: String,
    example: 'example',
    maxLength: 15,
    minLength: 3,
  },

  phoneNumber: {
    description: 'User phone number',
    type: String,
    example: '+380970809685',
    maxLength: 15,
    minLength: 8,
    nullable: true,
  },

  firstName: {
    description: 'User first name',
    type: String,
    example: 'john',
    maxLength: 15,
    minLength: 2,
    nullable: true,
  },

  lastName: {
    description: 'User last name',
    type: String,
    example: 'doe',
    maxLength: 15,
    minLength: 2,
    nullable: true,
  },

  dateOfBirth: {
    description: 'Date of user birth',
    type: String,
    example: '1991-09-17',
    format: 'date',
    nullable: true,
  },

  gender: {
    description: 'User gender',
    type: String,
    example: 'male',
    nullable: true,
  },

  password: {
    description: 'User password',
    type: String,
    example: '12341234',
    maxLength: 128,
    minLength: 6,
  },
} satisfies Record<string, UserProperties>;
