import "axios";

declare module "axios" {
  export interface AxiosRequestConfig {
    customData?: any;
  }
  export interface AxiosResponse<T = any> {
    customData?: any;
  }
}
