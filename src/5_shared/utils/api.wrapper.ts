import { AxiosResponse } from 'axios';

import { API } from '../../../test/e2e/helpers/api';

export class APITesting {
  public async post(
    path: string,
    data: Record<string, any>,
  ): Promise<AxiosResponse<any, any> | undefined> {
    try {
      const result = await API.post(path, data);

      return result;
    } catch (error: any) {
      if (error.response) {
        console.error(
          `${error.response.statusText} - ${error.response.status} - ${error.response.data?.message}.\nresponse body - ${JSON.stringify(error.response.data?.field)}`,
        );
      } else {
        console.error(error.message);
      }
    }
  }

  public async patch(
    path: string,
    data: Record<string, any>,
  ): Promise<AxiosResponse<any, any> | undefined> {
    try {
      const result = await API.patch(path, data);

      return result;
    } catch (error: any) {
      if (error.response) {
        console.error(
          `${error.response.statusText} - ${error.response.status} - ${error.response.data?.message}.\nresponse body - ${JSON.stringify(error.response.data?.field)}`,
        );
      } else {
        console.error(error.message);
      }
    }
  }

  public async delete(
    path: string,
    data: Record<string, any>,
  ): Promise<AxiosResponse<any, any> | undefined> {
    try {
      const result = await API.delete(path, data);

      return result;
    } catch (error: any) {
      if (error.response) {
        console.error(
          `${error.response.statusText} - ${error.response.status} - ${error.response.data?.message}.\nresponse body - ${JSON.stringify(error.response.data?.field)}`,
        );
      } else {
        console.error(error.message);
      }
    }
  }

  public async put(
    path: string,
    data: Record<string, any>,
  ): Promise<AxiosResponse<any, any> | undefined> {
    try {
      const result = await API.put(path, data);

      return result;
    } catch (error: any) {
      if (error.response) {
        console.error(
          `${error.response.statusText} - ${error.response.status} - ${error.response.data?.message}.\nresponse body - ${JSON.stringify(error.response.data?.field)}`,
        );
      } else {
        console.error(error.message);
      }
    }
  }

  public async get(
    path: string,
    data: Record<string, any>,
  ): Promise<AxiosResponse<any, any> | undefined> {
    try {
      const result = await API.get(path, data);

      return result;
    } catch (error: any) {
      if (error.response) {
        console.error(
          `${error.response.statusText} - ${error.response.status} - ${error.response.data?.message}.\nresponse body - ${JSON.stringify(error.response.data?.field)}`,
        );
      } else {
        console.error(error.message);
      }
    }
  }
}
