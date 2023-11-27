import { ClientProfile, Credential, ClientConfig, HttpProfile, DynamicCredential } from "./interface";
export declare type ResponseCallback<TReuslt = any> = (error: string, rep: TReuslt) => void;
export interface RequestOptions extends Partial<Pick<HttpProfile, "headers">> {
    multipart?: boolean;
    /**
     * 中止请求信号
     */
    signal?: AbortSignal;
}
declare type ResponseData = any;
/**
 * @inner
 */
export declare class AbstractClient {
    sdkVersion: string;
    path: string;
    credential: Credential | DynamicCredential;
    region: string;
    apiVersion: string;
    endpoint: string;
    profile: ClientProfile;
    /**
     * 实例化client对象
     * @param {string} endpoint 接入点域名
     * @param {string} version 产品版本
     * @param {Credential} credential 认证信息实例
     * @param {string} region 产品地域
     * @param {ClientProfile} profile 可选配置实例
     */
    constructor(endpoint: string, version: string, { credential, region, profile }: ClientConfig);
    getCredential(): Promise<Credential>;
    /**
     * @inner
     */
    request(action: string, req: any, options?: ResponseCallback | RequestOptions, cb?: ResponseCallback): Promise<ResponseData>;
    /**
     * @inner
     */
    private doRequest;
    /**
     * @inner
     */
    private doRequestWithSign3;
    private parseResponse;
    /**
     * @inner
     */
    private mergeData;
    /**
     * @inner
     */
    private formatRequestData;
    /**
     * @inner
     */
    private formatSignString;
}
export {};
