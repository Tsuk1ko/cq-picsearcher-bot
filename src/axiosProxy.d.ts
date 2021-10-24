import { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';

export = AxiosProxy;

declare namespace AxiosProxy {
  const client: AxiosInstance;
  function get<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R>;
  function post<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R>;
  function getBase64(url: string, config?: AxiosRequestConfig): Promise<string>;
}
