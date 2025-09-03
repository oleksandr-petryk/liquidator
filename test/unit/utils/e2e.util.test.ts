import {
  IsEmail,
  IsPhoneNumber,
  IsString,
  Length,
  validateSync,
} from 'class-validator';

import { USER_PROPERTIES } from '../../../src/5_shared/config/const/user.const';
import {
  randomEmail,
  randomPassword,
  randomPhoneNumber,
  randomUsername,
} from '../../../src/5_shared/utils/e2e.util';

class TestEmailDto {
  @IsEmail()
  email!: string;
}

class TestUsernameDto {
  @Length(
    USER_PROPERTIES.username.minLength!,
    USER_PROPERTIES.username.maxLength!,
  )
  @IsString()
  username!: string;
}

class TestPasswordDto {
  @Length(
    USER_PROPERTIES.password.minLength!,
    USER_PROPERTIES.password.maxLength!,
  )
  @IsString()
  password!: string;
}

class TestPhoneNumberDto {
  @IsPhoneNumber()
  phoneNumber!: string;
}

test('random email generation', () => {
  const email = randomEmail();

  const dto = new TestEmailDto();
  dto.email = email;

  const errors = validateSync(dto);

  expect(errors.length).toBe(0);
});

test('random username generation', () => {
  const username = randomUsername();

  const dto = new TestUsernameDto();
  dto.username = username;

  const errors = validateSync(dto);

  expect(errors.length).toBe(0);
});

test('random username generation', () => {
  const password = randomPassword();

  const dto = new TestPasswordDto();
  dto.password = password;

  const errors = validateSync(dto);

  expect(errors.length).toBe(0);
});

test('random phone number generation', () => {
  const phoneNumber = randomPhoneNumber();

  const dto = new TestPhoneNumberDto();
  dto.phoneNumber = phoneNumber;

  const errors = validateSync(dto);
  console.log(errors);

  expect(errors.length).toBe(0);
});
