import { APP_HEALTH_LIVE } from '../../src/shared/const/app.const';
import { API } from './helpers/api';

describe('Platform Tests', () => {
  test('/health - OK', async () => {
    const response = await API.get('/health');

    expect(response.status).toBe(200);
    expect(response.data).toMatchObject({
      payload: {
        status: APP_HEALTH_LIVE,
      },
    });
    expect(response.data.payload.status).toBe(APP_HEALTH_LIVE);
  });

  test('/version - OK', async () => {
    const response = await API.get('/version');

    expect(response.status).toBe(200);
    expect(response.data).toMatchObject({
      payload: {},
    });
    expect(response.data.payload.version).toBeDefined();
  });
});
