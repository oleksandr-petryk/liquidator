import { faker } from '@faker-js/faker';

import { API } from './helpers/api';

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
        expect(e?.response?.data?.message).toBe('User not found');
      }
    });
  });

  describe('Get user sessions', () => {
    test('/auth/session/ - OK', async () => {
      const data = {
        email: faker.internet.email(),
        username: faker.internet.username(),
        password: faker.internet.password(),
      };

      await API.post('/v1/auth/register', data);

      const loginResponse = await API.post('/v1/auth/log-in', data);

      const response = await API.get('/v1/auth/session', {
        headers: { token: loginResponse.data.payload.refreshToken },
      });

      expect(response.status).toBe(200);
      expect(response.data.payload).toBeTruthy();
      expect(response.data.payload[0].name).toBeTruthy();
      expect(response.data.payload[0].userId).toBeTruthy();
      expect(response.data.payload[0].refreshToken).toBeTruthy();
      expect(response.data.payload[0].createdAt).toBeTruthy();
    });

    test('/auth/session/ - NOK - incorrect refresh token', async () => {
      const data = {
        email: faker.internet.email(),
        username: faker.internet.username(),
        password: faker.internet.password(),
      };

      await API.post('/v1/auth/register', data);

      await API.post('/v1/auth/log-in', data);

      try {
        await API.get('/v1/auth/session', {
          headers: { token: '------' },
        });
        throw new Error('Error expected');
      } catch (e: any) {
        expect(e?.response?.status).toBe(500);
        expect(e?.response?.data?.message).toBe('Internal server error');
      }
    });
  });

  describe('Update sessions', () => {
    test('/auth/session/:id/ - OK', async () => {
      const data = {
        email: faker.internet.email(),
        username: faker.internet.username(),
        password: faker.internet.password(),
      };

      await API.post('/v1/auth/register', data);

      const loginResponse = await API.post('/v1/auth/log-in', data);

      const getSessionsResponse = await API.get('/v1/auth/session', {
        headers: { token: loginResponse.data.payload.refreshToken },
      });

      const response = await API.patch(
        `/v1/auth/session/${getSessionsResponse.data.payload[0].id}`,
        {
          name: '------',
        },
      );

      expect(response.status).toBe(200);
      expect(response.data.payload).toBeTruthy();
      expect(response.data.payload[0].name).toBe('------');
      expect(response.data.payload[0].userId).toBeTruthy();
      expect(response.data.payload[0].refreshToken).toBeTruthy();
      expect(response.data.payload[0].createdAt).toBeTruthy();
      expect(response.data.payload[0].updatedAt).toBeTruthy();
    });

    test('/auth/session/ - NOK - incorrect id', async () => {
      const data = {
        email: faker.internet.email(),
        username: faker.internet.username(),
        password: faker.internet.password(),
      };

      await API.post('/v1/auth/register', data);

      await API.post('/v1/auth/log-in', data);

      try {
        await API.patch(`/v1/auth/session/---`, {
          name: '------',
        });
        throw new Error('Error expected');
      } catch (e: any) {
        expect(e?.response?.status).toBe(500);
        expect(e?.response?.data?.message).toBe('Internal server error');
      }
    });
  });

  describe('Delete sessions', () => {
    test('/auth/session/:id/ - OK', async () => {
      const data = {
        email: faker.internet.email(),
        username: faker.internet.username(),
        password: faker.internet.password(),
      };

      await API.post('/v1/auth/register', data);

      const loginResponse = await API.post('/v1/auth/log-in', data);

      const getSessionsResponse = await API.get('/v1/auth/session', {
        headers: { token: loginResponse.data.payload.refreshToken },
      });

      const deleteSessionResponse = await API.delete(
        `/v1/auth/session/${getSessionsResponse.data.payload[0].id}`,
      );

      const response = await API.get('/v1/auth/session', {
        headers: { token: loginResponse.data.payload.refreshToken },
      });

      expect(deleteSessionResponse.status).toBe(200);
      expect(deleteSessionResponse.data.payload).toBeTruthy();
      expect(response.data.payload).toBeTruthy();
      expect(response.data.payload[0]).toBeFalsy();
    });

    test('/auth/session/ - NOK - incorrect id', async () => {
      const data = {
        email: faker.internet.email(),
        username: faker.internet.username(),
        password: faker.internet.password(),
      };

      await API.post('/v1/auth/register', data);

      await API.post('/v1/auth/log-in', data);

      try {
        await API.delete(`/v1/auth/session/---`);
        throw new Error('Error expected');
      } catch (e: any) {
        expect(e?.response?.status).toBe(500);
        expect(e?.response?.data?.message).toBe('Internal server error');
      }
    });
  });
});
