/**
 * @inner
 */
export default class Sign {
    static sign(secretKey: string, signStr: string, signMethod: string): string;
    static sign3({ method, url, payload, timestamp, service, secretId, secretKey, multipart, boundary, }: {
        method?: string;
        url?: string;
        payload: any;
        timestamp: number;
        service: string;
        secretId: string;
        secretKey: string;
        multipart: boolean;
        boundary: string;
    }): string;
}
