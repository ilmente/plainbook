import * as parseFrontMatter from 'gray-matter';
import * as parseMarkdown from 'marked';
import { contains } from 'ramda';
import { Config } from './config';

export interface File { 
    content: string
    excerpt: string
    meta: any
}

export class Parser { 
    readonly config: Config

    constructor(config: Config) { 
        this.config = config;
    }

    async parseFile(rawFile: string): Promise<File> {
        const file = parseFrontMatter(rawFile);

        return {
            content: file.content,
            excerpt: file.excerpt,
            meta: file.data
        }
    }

    async parseContent(extension: string, content: string): Promise<string> {
        if (contains(extension, this.config.extension.raw)) {
            return content;
        }

        if (contains(extension, this.config.extension.markdown)) {
            return parseMarkdown(content);
        }

        return '';
    }
}
