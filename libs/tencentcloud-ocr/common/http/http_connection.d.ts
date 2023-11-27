/// <reference types="node" />
import { Response } from "node-fetch";
import { Agent } from "http";
/**
 * @inner
 */
export declare class HttpConnection {
    static doRequest({ method, url, data, timeout, headers, agent, proxy, signal, }: {
        method: string;
        url: string;
        data: any;
        timeout: number;
        headers?: Record<string, string>;
        agent?: Agent;
        proxy?: string;
        signal?: AbortSignal;
    }): Promise<Response>;
    static doRequestWithSign3({ method, url, data, service, action, region, version, secretId, secretKey, multipart, timeout, token, requestClient, language, headers, agent, proxy, signal, }: {
        method: string;
        url: string;
        data: any;
        service: string;
        action: string;
        region: string;
        version: string;
        secretId: string;
        secretKey: string;
        multipart?: boolean;
        timeout?: number;
        token: string;
        requestClient: string;
        language: string;
        headers?: Record<string, string>;
        agent?: Agent;
        proxy?: string;
        signal?: AbortSignal;
    }): Promise<Response>;
}
