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
const fs_1 = require("fs");
const util_1 = require("util");
const path_1 = require("path");
const fsReadFile = util_1.promisify(fs_1.readFile);
class Content {
    constructor(config, crawler, parser) {
        this.config = config;
        this.crawler = crawler;
        this.parser = parser;
    }
    getSlug(fullPath) {
        const condition = this.crawler.allowedExtensions.map((ext) => `\\${ext}`).join('|');
        const regexp = new RegExp(`(${condition})$`);
        const slug = fullPath
            .replace(this.config.path.content, '')
            .replace('/index', '')
            .replace(regexp, '');
        return slug || '/';
    }
    getAbstracts(paths) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all(paths.map((path) => this.getAbstract.call(this, path)));
        });
    }
    createAbstractMap(abstracts) {
        return abstracts.reduce((map, abstract) => map.set(abstract.slug, abstract), new Map());
    }
    getAbstractMap() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.crawler.crawl(this.config.path.content)
                .then((files) => this.getAbstracts(files))
                .then((abstracts) => this.createAbstractMap(abstracts));
        });
    }
    getAbstract(path) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = yield this.parser.parseFile(yield fsReadFile(path, 'utf8'));
            return {
                path,
                extension: path_1.extname(path),
                slug: this.getSlug(path),
                excerpt: file.excerpt,
                meta: file.meta
            };
        });
    }
    getDocument(path) {
        return __awaiter(this, void 0, void 0, function* () {
            const extension = path_1.extname(path);
            const file = yield this.parser.parseFile(yield fsReadFile(path, 'utf8'));
            const content = yield this.parser.parseContent(extension, file.content);
            return {
                path,
                extension,
                slug: this.getSlug(path),
                content,
                excerpt: file.excerpt,
                meta: file.meta
            };
        });
    }
}
exports.Content = Content;
