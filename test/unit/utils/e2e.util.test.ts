import {
  IsEmail,
  IsPhoneNumber,
  IsString,
  Length,
  validateSync,
} from 'class-validator';

import { USER_PROPERTIES } from '../../../src/5_shared/config/const/user.const';
import {
  randomEmailGeneration,
  randomPhoneNumberGeneration,
  randomUsernameGeneration,
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

class TestPhoneNumberDto {
  @IsPhoneNumber()
  phoneNumber!: string;
}

test('random email generation', () => {
  const randomEmail = randomEmailGeneration();

  const dto = new TestEmailDto();
  dto.email = randomEmail;

  const errors = validateSync(dto);

  expect(errors.length).toBe(0);
});

test('random username generation', () => {
  const randomUsername = randomUsernameGeneration();

  const dto = new TestUsernameDto();
  dto.username = randomUsername;

  const errors = validateSync(dto);

  expect(errors.length).toBe(0);
});

test('random phone number generation', () => {
  const randomPhoneNumber = randomPhoneNumberGeneration();

  const dto = new TestPhoneNumberDto();
  dto.phoneNumber = randomPhoneNumber;

  const errors = validateSync(dto);
  console.log(errors);

  expect(errors.length).toBe(0);
});
