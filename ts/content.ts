import { readFile } from 'fs';
import { promisify } from 'util';
import { extname } from 'path';
import { Crawler } from './crawler';
import { Parser, File } from './parser';
import { Config } from './config';

const fsReadFile = promisify(readFile);

export interface Abstract {
    path: string
    extension: string
    slug: string
    excerpt: string
    meta: any
}

export type AbstractMap = Map<string, Abstract>

export interface Document extends Abstract { 
    content: string
}

export class Content { 
    protected readonly config: Config
    protected readonly crawler: Crawler
    protected readonly parser: Parser

    constructor(config: Config, crawler: Crawler, parser: Parser) { 
        this.config = config;
        this.crawler = crawler;
        this.parser = parser;
    }

    protected getSlug(fullPath: string): string {
        const condition = this.crawler.allowedExtensions.map((ext: string) => `\\${ext}`).join('|');
        const regexp = new RegExp(`(${condition})$`);
        const slug = fullPath
            .replace(this.config.path.content, '')
            .replace('/index', '')
            .replace(regexp, '');

        return slug || '/';
    }

    protected async getAbstracts(paths: string[]): Promise<Abstract[]> {
        return Promise.all(paths.map((path: string) => this.getAbstract.call(this, path)));
    }

    protected createAbstractMap(abstracts: Abstract[]): AbstractMap {
        return abstracts.reduce(
            (map: AbstractMap, abstract: Abstract) => map.set(abstract.slug, abstract),
            new Map<string, Abstract>()
        );
    }

    async getAbstractMap(): Promise<AbstractMap> {
        return this.crawler.crawl(this.config.path.content)
            .then((files: string[]) => this.getAbstracts(files))
            .then((abstracts: Abstract[]) => this.createAbstractMap(abstracts))
    }

    async getAbstract(path: string): Promise<Abstract> {
        const file = await this.parser.parseFile(await fsReadFile(path, 'utf8'));

        return {
            path,
            extension: extname(path),
            slug: this.getSlug(path),
            excerpt: file.excerpt,
            meta: file.meta
        }
    }

    async getDocument(path: string): Promise<Document> {
        const extension = extname(path);
        const file = await this.parser.parseFile(await fsReadFile(path, 'utf8'));
        const content = await this.parser.parseContent(extension, file.content);

        return {
            path,
            extension,
            slug: this.getSlug(path),
            content,
            excerpt: file.excerpt,
            meta: file.meta
        }
    }
}

