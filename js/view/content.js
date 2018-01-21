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
class ContentView {
    constructor(config, map, document) {
        this.config = config;
        this.map = map;
        this.document = document;
    }
    handler(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const view = yield this.render();
            reply
                .type('text/html')
                .code(200)
                .send(view);
        });
    }
    render() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.document.content;
        });
    }
}
exports.ContentView = ContentView;
