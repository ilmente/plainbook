"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const ramda_1 = require("ramda");
const cwd = process.cwd();
const defaultConfig = {
    server: {
        name: 'plainbook',
        host: 'localhost',
        port: 3344
    },
    path: {
        content: path_1.resolve(cwd, './content'),
        static: {
            '/public': path_1.resolve(cwd, './public')
        }
    },
    extension: {
        raw: ['.html'],
        markdown: ['.md', '.markdown']
    },
    custom: {}
};
function config(partialConfig = {}) {
    return ramda_1.mergeDeepRight(defaultConfig, partialConfig);
}
exports.config = config;
