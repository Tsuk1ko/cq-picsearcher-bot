/**
 * @inner
 */
export default class TencentCloudSDKHttpException extends Error {
    /**
     * 请求id
     */
    requestId: string;
    /**
     * http状态码
     */
    httpCode?: number;
    /**
     * 接口返回状态码
     */
    code?: string;
    constructor(error: string, requestId?: string);
    getMessage(): string;
    getRequestId(): string;
    toString(): string;
    toLocaleString(): string;
}
