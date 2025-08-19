import { UserProperties } from '../../types/user.type';
import { APP_USER_LENGTHS } from './app.const';

export const USER_PROPERTIES = {
  email: {
    description: 'User email',
    type: String,
    example: 'example@gmail.com',
    maxLength: APP_USER_LENGTHS.email.max,
    minLength: APP_USER_LENGTHS.email.min,
  },

  username: {
    description: 'Username of user',
    type: String,
    example: 'example',
    maxLength: APP_USER_LENGTHS.username.max,
    minLength: APP_USER_LENGTHS.username.min,
  },

  phoneNumber: {
    description: 'User phone number',
    type: String,
    example: '+380970809685',
    maxLength: APP_USER_LENGTHS.phoneNumber.max,
    minLength: APP_USER_LENGTHS.phoneNumber.min,
    nullable: true,
  },

  firstName: {
    description: 'User first name',
    type: String,
    example: 'john',
    maxLength: APP_USER_LENGTHS.name.max,
    minLength: APP_USER_LENGTHS.name.min,
    nullable: true,
  },

  lastName: {
    description: 'User last name',
    type: String,
    example: 'doe',
    maxLength: APP_USER_LENGTHS.name.max,
    minLength: APP_USER_LENGTHS.name.min,
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
    example: '123123',
    minLength: APP_USER_LENGTHS.password.max,
    maxLength: APP_USER_LENGTHS.password.min,
  },
} satisfies Record<string, UserProperties>;
