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

describe('Random email generation', () => {
  test('Random email generation', () => {
    const email = randomEmail();

    const dto = new TestEmailDto();
    dto.email = email;

    const errors = validateSync(dto);

    expect(errors.length).toBe(0);
  });

  test('Check correlations', () => {
    const email: string[] = [];

    for (let i = 0; i < 100; i++) {
      email[i] = randomEmail();
    }

    const check = new Set(email).size === email.length;

    expect(check).toBe(true);
  });
});

describe('Random username generation', () => {
  test('random username generation', () => {
    const username = randomUsername();

    const dto = new TestUsernameDto();
    dto.username = username;

    const errors = validateSync(dto);

    expect(errors.length).toBe(0);
  });

  test('Check correlations', () => {
    const username: string[] = [];

    for (let i = 0; i < 100; i++) {
      username[i] = randomUsername();
    }

    const check = new Set(username).size === username.length;

    expect(check).toBe(true);
  });
});

describe('Random username generation', () => {
  test('random username generation', () => {
    const password = randomPassword();

    const dto = new TestPasswordDto();
    dto.password = password;

    const errors = validateSync(dto);

    expect(errors.length).toBe(0);
  });

  test('Check correlations', () => {
    const password: string[] = [];

    for (let i = 0; i < 100; i++) {
      password[i] = randomPassword();
    }

    const check = new Set(password).size === password.length;

    expect(check).toBe(true);
  });
});

describe('Random phone number generation', () => {
  test('Check functional', () => {
    const phoneNumber = randomPhoneNumber();

    const dto = new TestPhoneNumberDto();
    dto.phoneNumber = phoneNumber;

    const errors = validateSync(dto);

    expect(errors.length).toBe(0);
  });

  test('Check correlations', () => {
    const phoneNumber: string[] = [];

    for (let i = 0; i < 100; i++) {
      phoneNumber[i] = randomPhoneNumber();
    }

    const check = new Set(phoneNumber).size === phoneNumber.length;

    expect(check).toBe(true);
  });
});
