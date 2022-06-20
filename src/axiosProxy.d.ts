import { AxiosInstance, AxiosRequestConfig } from 'axios';

export = AxiosProxy;

declare namespace AxiosProxy {
  const client: AxiosInstance;
  const get: AxiosInstance['get'];
  const post: AxiosInstance['post'];
  function getBase64(url: string, config?: AxiosRequestConfig): Promise<string>;
  const cfClient: AxiosInstance;
  const cfGet: AxiosInstance['get'];
  const cfPost: AxiosInstance['post'];
}
