import axios, { AxiosResponse } from 'axios';
import * as http from 'http';

import { APP_DEFAULT_GLOBAL_URL_PREFIX } from '../../../src/5_shared/config/const/app.const';

const agent = new http.Agent({ keepAlive: false });

const BASE_URL = `http://localhost:${process.env.PORT}/${process.env.APP_GLOBAL_URL_PREFIX || APP_DEFAULT_GLOBAL_URL_PREFIX}`;

export const API = axios.create({
  baseURL: BASE_URL,
  httpAgent: agent,
});

afterAll(() => {
  agent.destroy();
});

export async function expectApiError<T = any>(
  callback: () => Promise<T>,
): Promise<AxiosResponse<T>> {
  try {
    await callback();

    throw new Error('Error expected');
  } catch (e: any) {
    return e.response as AxiosResponse<T>;
  }
}
