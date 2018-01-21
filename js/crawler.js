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
const ramda_1 = require("ramda");
const fsReadDir = util_1.promisify(fs_1.readdir);
class Crawler {
    constructor(config) {
        this.config = config;
        this.allowedExtensions = ramda_1.concat(config.extension.raw, config.extension.markdown);
    }
    filterFiles(paths) {
        return paths.filter((path) => ramda_1.contains(path_1.extname(path), this.allowedExtensions));
    }
    filterDirectories(paths) {
        return paths.filter((path) => ramda_1.isEmpty(path_1.extname(path)));
    }
    readDirectories(paths) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all(paths.map((path) => __awaiter(this, void 0, void 0, function* () { return this.readDirectory(path); })));
        });
    }
    readDirectory(path) {
        return __awaiter(this, void 0, void 0, function* () {
            const childRelativePaths = yield fsReadDir(path);
            return childRelativePaths.map((childRelativePath) => path_1.join(path, childRelativePath));
        });
    }
    crawlRecursivly(directories, files) {
        return __awaiter(this, void 0, void 0, function* () {
            if (directories.length === 0) {
                return files;
            }
            const paths = ramda_1.flatten(yield this.readDirectories(directories));
            return this.crawlRecursivly(this.filterDirectories(paths), ramda_1.concat(files, this.filterFiles(paths)));
        });
    }
    crawl(path) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.crawlRecursivly([path], []);
        });
    }
}
exports.Crawler = Crawler;
