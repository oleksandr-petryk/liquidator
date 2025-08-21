import { faker } from '@faker-js/faker';
import axios from 'axios';

import { API, expectApiError } from './helpers/api';

describe('Auth Tests', () => {
  describe('Register', () => {
    test('/auth/register/ - OK', async () => {
      const data = {
        email: faker.internet.email(),
        username: faker.internet.username(),
        password: faker.internet.password(),
      };

      const response = await API.post('/v1/auth/register', data);

      expect(response.status).toEqual(201);
    });

    test('/v1/auth/register/ - NOK - email already exists', async () => {
      const data = {
        email: faker.internet.email(),
        username: faker.internet.username(),
        password: faker.internet.password(),
      };

      await API.post('/v1/auth/register', data);

      try {
        await API.post('/v1/auth/register', data);

        throw new Error('Error expected');
      } catch (e: any) {
        expect(e?.response?.status).toBe(400);
        expect(e?.response?.data?.message).toBe(
          'User with that email already exist',
        );
      }
    });

    test('/auth/register/ - NOK - username already exists', async () => {
      const data = {
        email: faker.internet.email(),
        username: faker.internet.username(),
        password: faker.internet.password(),
      };

      await API.post('/v1/auth/register', data);

      try {
        await API.post('/v1/auth/register', {
          ...data,
          email: faker.internet.email(),
        });

        throw new Error('Error expected');
      } catch (e: any) {
        expect(e?.response?.status).toBe(400);
        expect(e?.response?.data?.message).toBe(
          'User with that username already exist',
        );
      }
    });
  });

  describe('Login', () => {
    test('/v/1auth/log-in/ - OK', async () => {
      const data = {
        email: faker.internet.email(),
        username: faker.internet.username(),
        password: faker.internet.password(),
      };

      await API.post('/v1/auth/register', data);

      const response = await API.post('/v1/auth/log-in', data);

      expect(response.status).toBe(201);
      expect(response.data.payload).toBeTruthy();
      expect(response.data.payload.refreshToken).toBeTruthy();
      expect(response.data.payload.accessToken).toBeTruthy();
    });

    test('/v/1auth/log-in/ - NOK - wrong password', async () => {
      const data = {
        email: faker.internet.email(),
        username: faker.internet.username(),
        password: faker.internet.password(),
      };

      await API.post('/v1/auth/register', data);

      try {
        await API.post('/v1/auth/log-in', {
          ...data,
          password: '--------',
        });

        throw new Error('Error expected');
      } catch (e: any) {
        expect(e?.response?.status).toBe(400);
        expect(e?.response?.data?.message).toBe('Incorrect password');
      }
    });

    test('/v/1auth/log-in/ - NOK - user not exists', async () => {
      const data = {
        email: faker.internet.email(),
        username: faker.internet.username(),
        password: faker.internet.password(),
      };

      await API.post('/v1/auth/register', data);

      try {
        await API.post('/v1/auth/log-in', {
          ...data,
          email: 'a@mail.com',
        });

        throw new Error('Error expected');
      } catch (e: any) {
        expect(e?.response?.status).toBe(400);
        expect(e?.response?.data?.message).toBe(
          'User not exists or password is wrong',
        );
      }
    });
  });

  describe('Sessions', () => {
    test('Get - OK', async () => {
      const data = {
        email: faker.internet.email(),
        username: faker.internet.username(),
        password: faker.internet.password(),
      };

      await API.post('/v1/auth/register', data);

      await API.post('/v1/auth/log-in', data);
      await API.post('/v1/auth/log-in', data);
      const tokens = await API.post('/v1/auth/log-in', data);

      const response = await API.get('/v1/auth/sessions', {
        headers: {
          Authorization: 'Bearer ' + tokens.data.payload.accessToken,
        },
      });

      expect(response.status).toEqual(200);
      expect(response.data.payload.count).toEqual(3);
      expect(response.data.payload.items[0]).toMatchObject({
        id: expect.any(String),
      });
    });

    test('Get thisDevice - OK', async () => {
      const data = {
        email: faker.internet.email(),
        username: faker.internet.username(),
        password: faker.internet.password(),
      };

      await API.post('/v1/auth/register', data);

      await API.post('/v1/auth/log-in', data);
      const tokens = await API.post('/v1/auth/log-in', data);

      const response = await API.get('/v1/auth/sessions', {
        headers: {
          Authorization: 'Bearer ' + tokens.data.payload.accessToken,
        },
      });

      expect(response.status).toEqual(200);
      expect(response.data.payload.items[1]).toMatchObject({
        id: expect.any(String),
        thisDevice: false,
      });
      expect(response.data.payload.items[0]).toMatchObject({
        id: expect.any(String),
        thisDevice: true,
      });
    });

    test('Pagination - OK - default pagination', async () => {
      const data = {
        email: faker.internet.email(),
        username: faker.internet.username(),
        password: faker.internet.password(),
      };

      await API.post('/v1/auth/register', data);

      for (let i = 0; i < 12; i++) {
        await API.post('/v1/auth/log-in', data);
      }
      const tokens = await API.post('/v1/auth/log-in', data);

      const response_1 = await API.get('/v1/auth/sessions', {
        headers: {
          Authorization: 'Bearer ' + tokens.data.payload.accessToken,
        },
      });

      expect(response_1.status).toEqual(200);
      expect(response_1.data.payload.items.length).toEqual(10);
      expect(response_1.data.payload.items[0]).toMatchObject({
        id: expect.any(String),
      });

      const response_2 = await API.get('/v1/auth/sessions', {
        headers: {
          Authorization: 'Bearer ' + tokens.data.payload.accessToken,
        },
        params: {
          page: 2,
        },
      });

      expect(response_2.data.payload.items.length).toEqual(3);
    });

    test('Pagination - OK - custom pagination', async () => {
      const data = {
        email: faker.internet.email(),
        username: faker.internet.username(),
        password: faker.internet.password(),
      };

      await API.post('/v1/auth/register', data);

      for (let i = 0; i < 12; i++) {
        await API.post('/v1/auth/log-in', data);
      }
      const tokens = await API.post('/v1/auth/log-in', data);

      const response_1 = await API.get('/v1/auth/sessions', {
        headers: {
          Authorization: 'Bearer ' + tokens.data.payload.accessToken,
        },
        params: {
          page: 1,
          size: 9,
        },
      });

      expect(response_1.status).toEqual(200);
      expect(response_1.data.payload.items.length).toEqual(9);
      expect(response_1.data.payload.items[0]).toMatchObject({
        id: expect.any(String),
      });

      const response_2 = await API.get('/v1/auth/sessions', {
        headers: {
          Authorization: 'Bearer ' + tokens.data.payload.accessToken,
        },
        params: {
          page: 2,
          size: 9,
        },
      });

      expect(response_2.data.payload.items.length).toEqual(4);
    });

    test('Update - OK', async () => {
      const data = {
        email: faker.internet.email(),
        username: faker.internet.username(),
        password: faker.internet.password(),
      };

      await API.post('/v1/auth/register', data);

      const tokens = await API.post('/v1/auth/log-in', data);

      const session = await API.get('/v1/auth/sessions', {
        headers: {
          Authorization: 'Bearer ' + tokens.data.payload.accessToken,
        },
      });

      const id = session.data.payload.items[0].id;

      const response = await API.patch(
        `/v1/auth/sessions/${id}`,
        {
          name: 'john',
        },
        {
          headers: {
            Authorization: 'Bearer ' + tokens.data.payload.accessToken,
          },
        },
      );

      expect(response.status).toEqual(200);
      expect(response.data.payload).toMatchObject({
        id: expect.any(String),
        userId: expect.any(String),
        name: 'john',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
      expect(session.data.payload.items[0].updatedAt).not.toBe(
        response.data.payload.updatedAt,
      );
    });

    test('Delete - OK', async () => {
      const data = {
        email: faker.internet.email(),
        username: faker.internet.username(),
        password: faker.internet.password(),
      };

      await API.post('/v1/auth/register', data);

      const tokens_1 = await API.post('/v1/auth/log-in', data);
      const tokens_2 = await API.post('/v1/auth/log-in', data);
      await API.post('/v1/auth/log-in', data);

      const session = await API.get('/v1/auth/sessions', {
        headers: {
          Authorization: 'Bearer ' + tokens_1.data.payload.accessToken,
        },
      });

      const id = session.data.payload.items[2].id;

      await API.delete(`/v1/auth/sessions/${id}`, {
        headers: {
          Authorization: 'Bearer ' + tokens_1.data.payload.accessToken,
        },
      });

      const response_1 = await expectApiError(() =>
        API.delete(`/v1/auth/sessions/${id}`, {
          headers: {
            Authorization: 'Bearer ' + tokens_1.data.payload.accessToken,
          },
        }),
      );

      expect(response_1.status).toEqual(401);

      const response_2 = await expectApiError(() =>
        API.get('/v1/auth/sessions', {
          headers: {
            Authorization: 'Bearer ' + tokens_1.data.payload.accessToken,
          },
        }),
      );

      expect(response_2.status).toEqual(401);

      const response_3 = await API.get('/v1/auth/sessions', {
        headers: {
          Authorization: 'Bearer ' + tokens_2.data.payload.accessToken,
        },
      });

      expect(response_3.status).toEqual(200);
    });
  });

  describe('Account verification', () => {
    test('Account verification - OK', async () => {
      const data = {
        email: faker.internet.email(),
        username: faker.internet.username(),
        password: faker.internet.password(),
      };

      await API.post('/v1/auth/register', data);

      const mail = await axios.get(
        `http://localhost:9000/api/v1/mailbox/${data.email}/1`,
      );

      expect(mail.status).toEqual(200);

      const tokens = await API.post('/v1/auth/log-in', data);

      const response = await API.post(
        '/v1/auth/verify',
        { code: mail.data.body.text.match(/\b\d{6}\b/)[0] },
        {
          headers: {
            Authorization: 'Bearer ' + tokens.data.payload.accessToken,
          },
        },
      );

      expect(response.status).toEqual(201);
      expect(response.data.payload.message).toEqual(
        'Account successfully verified',
      );
    });

    test('Account verification email resending - OK', async () => {
      const data = {
        email: faker.internet.email(),
        username: faker.internet.username(),
        password: faker.internet.password(),
      };

      await API.post('/v1/auth/register', data);

      const mail_1 = await axios.get(
        `http://localhost:9000/api/v1/mailbox/${data.email}/1`,
      );

      expect(mail_1.status).toEqual(200);

      const tokens = await API.post('/v1/auth/log-in', data);

      await API.post(
        '/v1/auth/verify/send',
        {},
        {
          headers: {
            Authorization: 'Bearer ' + tokens.data.payload.accessToken,
          },
        },
      );

      const mail_2 = await axios.get(
        `http://localhost:9000/api/v1/mailbox/${data.email}/2`,
      );

      expect(mail_2.status).toEqual(200);
    });
  });

  describe('Get user', () => {
    test('Get user - OK', async () => {
      const data = {
        email: faker.internet.email(),
        username: faker.internet.username(),
        password: faker.internet.password(),
      };

      await API.post('/v1/auth/register', data);

      const tokens = await API.post('/v1/auth/log-in', data);

      const response = await API.get('/v1/user', {
        headers: {
          Authorization: 'Bearer ' + tokens.data.payload.accessToken,
        },
      });

      expect(response.status).toEqual(200);
      expect(response.data.payload).toMatchObject({
        id: expect.any(String),
        verified: false,
        email: data.email.toLowerCase(),
        phoneNumber: null,
        username: data.username.toLowerCase(),
        firstName: null,
        lastName: null,
        dateOfBirth: null,
        gender: null,
        pictureId: null,
        recoveryEmailAddress: null,
        createdAt: expect.any(String),
        updatedAt: null,
      });
    });
  });

  describe('Password reset', () => {
    test('Send password reset email - OK', async () => {
      const data = {
        email: faker.internet.email(),
        username: faker.internet.username(),
        password: faker.internet.password(),
      };

      await API.post('/v1/auth/register', data);

      await API.post('/v1/auth/password-reset/send/', data);

      const mail_1 = await axios.get(
        `http://localhost:9000/api/v1/mailbox/${data.email}/2`,
      );

      expect(mail_1.status).toEqual(200);
      expect(mail_1.data.subject).toEqual('Password reset');

      const mail_2 = await expectApiError(() =>
        axios.get(`http://localhost:9000/api/v1/mailbox/${data.email}/3`),
      );

      expect(mail_2.status).toEqual(404);
    });

    test('Password reset - OK', async () => {
      const data = {
        email: faker.internet.email(),
        username: faker.internet.username(),
        password: faker.internet.password(),
      };

      await API.post('/v1/auth/register', data);

      await API.post('/v1/auth/password-reset/send/', data);

      const mail = await axios.get(
        `http://localhost:9000/api/v1/mailbox/${data.email}/2`,
      );

      expect(mail.status).toEqual(200);
      expect(mail.data.subject).toEqual('Password reset');

      const newPassword = 'testPassword';

      await API.patch('/v1/auth/password-reset', {
        email: data.email,
        code: mail.data.body.text.match(/\b\d{6}\b/)[0],
        newPassword: newPassword,
      });

      const response = await API.post('/v1/auth/log-in', {
        email: data.email,
        password: newPassword,
      });

      expect(response.status).toEqual(201);
    });
  });

  describe('Password change', () => {
    test('Password change valid old password - OK', async () => {
      const data = {
        email: faker.internet.email(),
        username: faker.internet.username(),
        password: faker.internet.password(),
      };

      await API.post('/v1/auth/register', data);

      const tokens = await API.post('/v1/auth/log-in', data);

      const newPassword = 'testPassword';

      await API.patch(
        '/v1/auth/password-change',
        {
          oldPassword: data.password,
          newPassword: newPassword,
        },
        {
          headers: {
            Authorization: 'Bearer ' + tokens.data.payload.accessToken,
          },
        },
      );

      const mail = await axios.get(
        `http://localhost:9000/api/v1/mailbox/${data.email}/2`,
      );

      expect(mail.status).toEqual(200);
      expect(mail.data.subject).toEqual('Password changed');

      const response = await API.post('/v1/auth/log-in', {
        email: data.email,
        password: newPassword,
      });

      expect(response.status).toEqual(201);
    });

    test('Password change invalid old password - OK', async () => {
      const data = {
        email: faker.internet.email(),
        username: faker.internet.username(),
        password: faker.internet.password(),
      };

      await API.post('/v1/auth/register', data);

      const tokens = await API.post('/v1/auth/log-in', data);

      const newPassword = 'testPassword';

      await expectApiError(() =>
        API.patch(
          '/v1/auth/password-change',
          {
            oldPassword: 'invalid password',
            newPassword: newPassword,
          },
          {
            headers: {
              Authorization: 'Bearer ' + tokens.data.payload.accessToken,
            },
          },
        ),
      );

      const mail = await expectApiError(() =>
        axios.get(`http://localhost:9000/api/v1/mailbox/${data.email}/2`),
      );

      expect(mail.status).toEqual(404);

      const response = await expectApiError(() =>
        API.post('/v1/auth/log-in', {
          email: data.email,
          password: newPassword,
        }),
      );

      expect(response.status).toEqual(400);
    });
  });

  describe('Refresh token', () => {
    test('Refresh token - OK', async () => {
      const data = {
        email: faker.internet.email(),
        username: faker.internet.username(),
        password: faker.internet.password(),
      };

      await API.post('/v1/auth/register', data);

      const tokens = await API.post('/v1/auth/log-in', data);

      const newAccessToken = await API.post('/v1/auth/refresh', {
        refreshToken: tokens.data.payload.refreshToken,
      });

      const response_1 = await expectApiError(() =>
        API.post('/v1/auth/refresh', {
          refreshToken: tokens.data.payload.refreshToken,
        }),
      );

      expect(response_1.status).toEqual(400);

      const response_2 = await API.get('/v1/user', {
        headers: {
          Authorization: 'Bearer ' + newAccessToken.data.payload.accessToken,
        },
      });

      expect(response_2.status).toEqual(200);

      const response_3 = await expectApiError(() =>
        API.get('/v1/user', {
          headers: {
            Authorization: 'Bearer ' + tokens.data.payload.accessToken,
          },
        }),
      );

      expect(response_3.status).toEqual(401);

      const session = await API.get('/v1/auth/sessions', {
        headers: {
          Authorization: 'Bearer ' + newAccessToken.data.payload.accessToken,
        },
      });

      const id = session.data.payload.items[0].id;

      await API.delete(`/v1/auth/sessions/${id}`, {
        headers: {
          Authorization: 'Bearer ' + newAccessToken.data.payload.accessToken,
        },
      });

      const response_4 = await expectApiError(() =>
        API.get('/v1/user', {
          headers: {
            Authorization: 'Bearer ' + newAccessToken.data.payload.accessToken,
          },
        }),
      );

      expect(response_4.status).toEqual(401);
    });
  });
});
