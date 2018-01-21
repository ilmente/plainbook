"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class ErrorView {
    constructor(config) {
        this.config = config;
    }
    handler(error, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const view = yield this.render(error);
            console.error(error);
            reply
                .type('text/html')
                .code(500)
                .send(view);
        });
    }
    render(error) {
        return __awaiter(this, void 0, void 0, function* () {
            return `
            <h1>500 - Whoops! Something went wrong...</h1>
            <ul>
                <li><small>${error}</small></li>
            </ul>
        `;
        });
    }
}
exports.ErrorView = ErrorView;
