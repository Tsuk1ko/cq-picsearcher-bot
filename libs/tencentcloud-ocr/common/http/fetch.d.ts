import { RequestInit, Response } from "node-fetch";
export interface FetchOptions extends Omit<RequestInit, "signal"> {
    proxy?: string;
    headers?: Record<string, string>;
    signal?: AbortSignal;
}
export default function (url: string, options: FetchOptions): Promise<Response>;
