import axios from 'axios';
import * as http from 'http';

import { APP_DEFAULT_GLOBAL_URL_PREFIX } from '../../../src/shared/const/app.const';

const agent = new http.Agent({ keepAlive: false });

const BASE_URL = `http://localhost:${process.env.PORT}/${process.env.APP_GLOBAL_URL_PREFIX || APP_DEFAULT_GLOBAL_URL_PREFIX}`;

export const API = axios.create({
  baseURL: BASE_URL,
  httpAgent: agent,
});

afterAll(() => {
  agent.destroy();
});
