"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tencent_cloud_sdk_exception_1 = require("./exception/tencent_cloud_sdk_exception");
const crypto = require("crypto");
const url_1 = require("url");
const JSONBigInt = require("json-bigint");
const JSONbigNative = JSONBigInt({ useNativeBigInt: true });
/**
 * @inner
 */
class Sign {
    static sign(secretKey, signStr, signMethod) {
        const signMethodMap = {
            HmacSHA1: "sha1",
            HmacSHA256: "sha256",
        };
        if (!signMethodMap.hasOwnProperty(signMethod)) {
            throw new tencent_cloud_sdk_exception_1.default("signMethod invalid, signMethod only support (HmacSHA1, HmacSHA256)");
        }
        const hmac = crypto.createHmac(signMethodMap[signMethod], secretKey || "");
        return hmac.update(Buffer.from(signStr, "utf8")).digest("base64");
    }
    static sign3({ method = "POST", url = "", payload, timestamp, service, secretId, secretKey, multipart, boundary, }) {
        const urlObj = new url_1.URL(url);
        // 通用头部
        let headers = "";
        let signedHeaders = "";
        if (method === "GET") {
            signedHeaders = "content-type";
            headers = "content-type:application/x-www-form-urlencoded\n";
        }
        else if (method === "POST") {
            signedHeaders = "content-type";
            if (multipart) {
                headers = `content-type:multipart/form-data; boundary=${boundary}\n`;
            }
            else {
                headers = "content-type:application/json\n";
            }
        }
        headers += `host:${urlObj.hostname}\n`;
        signedHeaders += ";host";
        const path = urlObj.pathname;
        const querystring = urlObj.search.slice(1);
        let payload_hash = "";
        if (multipart) {
            const hash = crypto.createHash("sha256");
            hash.update(`--${boundary}`);
            for (const key in payload) {
                const content = payload[key];
                if (Buffer.isBuffer(content)) {
                    hash.update(`\r\nContent-Disposition: form-data; name="${key}"\r\nContent-Type: application/octet-stream\r\n\r\n`);
                    hash.update(content);
                    hash.update("\r\n");
                }
                else if (typeof content === "string") {
                    hash.update(`\r\nContent-Disposition: form-data; name="${key}"\r\n\r\n`);
                    hash.update(`${content}\r\n`);
                }
                hash.update(`--${boundary}`);
            }
            hash.update(`--\r\n`);
            payload_hash = hash.digest("hex");
        }
        else {
            payload_hash = payload ? getHash(JSONbigNative.stringify(payload)) : getHash("");
        }
        const canonicalRequest = method +
            "\n" +
            path +
            "\n" +
            querystring +
            "\n" +
            headers +
            "\n" +
            signedHeaders +
            "\n" +
            payload_hash;
        const date = getDate(timestamp);
        const StringToSign = "TC3-HMAC-SHA256" +
            "\n" +
            timestamp +
            "\n" +
            `${date}/${service}/tc3_request` +
            "\n" +
            getHash(canonicalRequest);
        const kDate = sha256(date, "TC3" + secretKey);
        const kService = sha256(service, kDate);
        const kSigning = sha256("tc3_request", kService);
        const signature = sha256(StringToSign, kSigning, "hex");
        return `TC3-HMAC-SHA256 Credential=${secretId}/${date}/${service}/tc3_request, SignedHeaders=${signedHeaders}, Signature=${signature}`;
    }
}
exports.default = Sign;
function sha256(message, secret = "", encoding) {
    const hmac = crypto.createHmac("sha256", secret);
    return hmac.update(message).digest(encoding);
}
function getHash(message, encoding = "hex") {
    const hash = crypto.createHash("sha256");
    return hash.update(message).digest(encoding);
}
function getDate(timestamp) {
    const date = new Date(timestamp * 1000);
    const year = date.getUTCFullYear();
    const month = ("0" + (date.getUTCMonth() + 1)).slice(-2);
    const day = ("0" + date.getUTCDate()).slice(-2);
    return `${year}-${month}-${day}`;
}
