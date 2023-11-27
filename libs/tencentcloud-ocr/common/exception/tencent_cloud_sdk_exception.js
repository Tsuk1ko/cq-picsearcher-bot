"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @inner
 */
class TencentCloudSDKHttpException extends Error {
    constructor(error, requestId = "") {
        super(error);
        this.requestId = requestId || "";
    }
    getMessage() {
        return this.message;
    }
    getRequestId() {
        return this.requestId;
    }
    toString() {
        return ("[TencentCloudSDKException]" +
            "message:" +
            this.getMessage() +
            "  requestId:" +
            this.getRequestId());
    }
    toLocaleString() {
        return ("[TencentCloudSDKException]" +
            "message:" +
            this.getMessage() +
            "  requestId:" +
            this.getRequestId());
    }
}
exports.default = TencentCloudSDKHttpException;
