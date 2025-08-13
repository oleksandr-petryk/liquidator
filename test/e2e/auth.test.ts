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
          password: '------',
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
          'User not found, email: a@mail.com',
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
        token: expect.any(String),
      });
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
        token: expect.any(String),
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

      const tokens = await API.post('/v1/auth/log-in', data);

      const session = await API.get('/v1/auth/sessions', {
        headers: {
          Authorization: 'Bearer ' + tokens.data.payload.accessToken,
        },
      });

      const id = session.data.payload.items[0].id;

      await API.delete(`/v1/auth/sessions/${id}`, {
        headers: {
          Authorization: 'Bearer ' + tokens.data.payload.accessToken,
        },
      });

      const response = await expectApiError(() =>
        API.delete(`/v1/auth/sessions/${id}`, {
          headers: {
            Authorization: 'Bearer ' + tokens.data.payload.accessToken,
          },
        }),
      );

      expect(response.status).toEqual(400);
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
        token: expect.any(String),
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
        token: expect.any(String),
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
});
