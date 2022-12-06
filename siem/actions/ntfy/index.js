"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
function default_1({ hostname, action, decoded, logger, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const { url, topic, auth, } = action.options;
        const serviceUrl = `${url}/${topic}`;
        let headers = {};
        if (auth) {
            const authBuffer = Buffer.from(`${auth.user}:${auth.password}`);
            const base64Auth = authBuffer.toString('base64');
            headers = {
                'Authorizaton': `Basic ${base64Auth}`,
            };
        }
        try {
            const request = yield fetch(serviceUrl, {
                method: 'POST',
                headers,
                body: `[${hostname}] ${decoded.description}`,
            });
            const requestJson = yield request.json();
        }
        catch (err) {
            logger.error(`${err}`);
        }
    });
}
exports.default = default_1;
