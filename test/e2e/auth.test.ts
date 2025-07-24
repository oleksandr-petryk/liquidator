import { faker } from '@faker-js/faker';

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

  describe('Get session', () => {
    test('/v1/auth/sessions/ - OK', async () => {
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
  });

  describe('Update session', () => {
    test('/v1/auth/sessions/ - OK', async () => {
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

      const response = await API.patch(`/v1/auth/sessions/${id}`, {
        name: 'john',
      });

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
  });

  describe('Delete session', () => {
    test('/v1/auth/sessions/ - OK', async () => {
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

      await API.delete(`/v1/auth/sessions/${id}`);

      const response = await expectApiError(() =>
        API.delete(`/v1/auth/sessions/${id}`),
      );

      expect(response.status).toEqual(404);
    });
  });
});
