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
const parseFrontMatter = require("gray-matter");
const parseMarkdown = require("marked");
const ramda_1 = require("ramda");
class Parser {
    constructor(config) {
        this.config = config;
    }
    parseFile(rawFile) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = parseFrontMatter(rawFile);
            return {
                content: file.content,
                excerpt: file.excerpt,
                meta: file.data
            };
        });
    }
    parseContent(extension, content) {
        return __awaiter(this, void 0, void 0, function* () {
            if (ramda_1.contains(extension, this.config.extension.raw)) {
                return content;
            }
            if (ramda_1.contains(extension, this.config.extension.markdown)) {
                return parseMarkdown(content);
            }
            return '';
        });
    }
}
exports.Parser = Parser;
