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
const config_1 = require("./config");
const crawler_1 = require("./crawler");
const parser_1 = require("./parser");
const content_1 = require("./content");
const server_1 = require("./server");
function bootstrap(partialConfig) {
    return __awaiter(this, void 0, void 0, function* () {
        const config = config_1.config(partialConfig);
        const crawler = new crawler_1.Crawler(config);
        const parser = new parser_1.Parser(config);
        const content = new content_1.Content(config, crawler, parser);
        const server = new server_1.Server(config, content);
        return server.setup()
            .then(() => server.listen());
    });
}
exports.bootstrap = bootstrap;
