import { AxiosResponse } from 'axios';

import { API } from '../../../test/e2e/helpers/api';

export class APITesting {
  private throwError(error: any, throwError: boolean): AxiosResponse<any, any> {
    if (error.response && throwError) {
      console.error(
        `${error.response.statusText} - ${error.response.status} - ${error.response.data?.message}.\nresponse body - ${JSON.stringify(error.response.data?.field)}`,
      );
      throw error;
    }

    return error.response;
  }

  public async post(
    path: string,
    {
      data,
      headers,
    }: {
      data: Record<string, any>;
      headers?: Record<any, any>;
    },
    throwError: boolean = true,
  ): Promise<AxiosResponse<any, any>> {
    try {
      const result = await API.post(path, data, { headers });

      return result;
    } catch (error: any) {
      return this.throwError(error, throwError);
    }
  }

  public async patch(
    path: string,
    {
      data,
      headers,
    }: {
      data: Record<string, any>;
      headers?: Record<any, any>;
    },
    throwError: boolean = true,
  ): Promise<AxiosResponse<any, any>> {
    try {
      const result = await API.patch(path, data, { headers });

      return result;
    } catch (error: any) {
      return this.throwError(error, throwError);
    }
  }

  public async delete(
    path: string,
    {
      headers,
    }: {
      headers?: Record<any, any>;
    },
    throwError: boolean = true,
  ): Promise<AxiosResponse<any, any>> {
    try {
      const result = await API.delete(path, { headers });

      return result;
    } catch (error: any) {
      return this.throwError(error, throwError);
    }
  }

  public async put(
    path: string,
    {
      data,
      headers,
    }: {
      data: Record<string, any>;
      headers?: Record<any, any>;
    },
    throwError: boolean = true,
  ): Promise<AxiosResponse<any, any>> {
    try {
      const result = await API.put(path, data, { headers });

      return result;
    } catch (error: any) {
      return this.throwError(error, throwError);
    }
  }

  public async get(
    path: string,
    {
      headers,
      params,
    }: {
      params?: Record<any, any>;
      headers?: Record<any, any>;
    },
    throwError: boolean = true,
  ): Promise<AxiosResponse<any, any>> {
    try {
      const result = await API.get(path, { headers, params });

      return result;
    } catch (error: any) {
      return this.throwError(error, throwError);
    }
  }
}
