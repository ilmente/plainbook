import { resolve } from 'path';
import { pathOr, split, mergeDeepRight } from 'ramda';

export interface PartialConfig {
    server?: {
        name?: string
        host?: string
        port?: number
    },

    path?: {
        content?: string,
        static?: {
            [key: string]: string
        }
    },

    extension?: {
        raw?: string[],
        markdown?: string[]
    }

    custom?: object
}

export interface Config extends PartialConfig {
    server: {
        name: string
        host: string
        port: number
    },

    path: {
        content: string,
        static: {
            [key: string]: string
        }
    },

    extension: {
        raw: string[],
        markdown: string[]
    }

    custom: object
}

const cwd = process.cwd();

const defaultConfig: Config = {
    server: {
        name: 'plainbook',
        host: 'localhost',
        port: 3344
    },

    path: {
        content: resolve(cwd, './content'),
        static: {
            '/public': resolve(cwd, './public')
        }
    },

    extension: {
        raw: ['.html'],
        markdown: ['.md', '.markdown']
    },

    custom: {} 
}

export function config(partialConfig: PartialConfig = {}): Config { 
    return mergeDeepRight(defaultConfig, partialConfig);
}

