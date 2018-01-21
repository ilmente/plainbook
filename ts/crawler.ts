import { readdir } from 'fs';
import { promisify } from 'util';
import { extname, join } from 'path';
import { flatten, concat, contains, isEmpty } from 'ramda';
import { Config } from './config';

const fsReadDir = promisify(readdir);

export class Crawler {
    protected readonly config: Config
    readonly allowedExtensions: string[]

    constructor(config: Config) {
        this.config = config;
        this.allowedExtensions = concat(config.extension.raw, config.extension.markdown);
    }

    protected filterFiles(paths: string[]): string[] {
        return paths.filter((path: string) => contains(extname(path), this.allowedExtensions));
    }

    protected filterDirectories(paths: string[]): string[] {
        return paths.filter((path: string) => isEmpty(extname(path)));
    }

    protected async readDirectories(paths: string[]): Promise<string[][]> {
        return Promise.all(paths.map(async (path: string) => this.readDirectory(path)));
    }

    protected async readDirectory(path: string): Promise<string[]> {
        const childRelativePaths = await fsReadDir(path);
        return childRelativePaths.map((childRelativePath: string) => join(path, childRelativePath));
    }

    protected async crawlRecursivly(directories: string[], files: string[]): Promise<string[]> {
        if (directories.length === 0) {
            return files;
        }

        const paths = flatten(await this.readDirectories(directories));

        return this.crawlRecursivly(
            this.filterDirectories(paths),
            concat(files, this.filterFiles(paths))
        );
    }

    async crawl(path: string): Promise<string[]> {
        return this.crawlRecursivly([path], []);
    }
}

