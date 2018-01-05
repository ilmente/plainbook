import { readdir, readFile as readfile } from 'fs';
import { promisify } from 'util';
import { extname, join } from 'path';
import { flatten, concat, contains, isEmpty } from 'ramda';
import { parseFile, parseContent, IFile } from './parser';
import { path, content } from '../config';

const fsReadDir = promisify(readdir);
const fsReadFile = promisify(readfile);

export interface IAbstractDocument {
    fullPath: string
    extension: string
    slug: string
    excerpt: string
    meta: any
}

export interface IDocument extends IAbstractDocument { 
    content: string
}

export type IAbstractDocumentMap = Map<string, IAbstractDocument>

function getSlug(fullPath: string): string {
    const slug = fullPath
        .replace(path.content, '')
        .replace('.md', '')
        .replace('/index', '');

    return slug || '/';
}

function filterFiles(paths: string[]): string[] {
    return paths.filter(p => contains(extname(p), content.extensions));
}

function filterDirectories(paths: string[]): string[] {
    return paths.filter(p => isEmpty(extname(p)));
}

async function scanDirectories(paths: string[]): Promise<string[][]> {
    return Promise.all(paths.map(scanDirectory));
}

async function scanDirectory(path: string): Promise<string[]> {
    return (await fsReadDir(path)).map(childRelativePath => join(path, childRelativePath));
}

async function crawl(directories: string[], files: string[]): Promise<string[]> {
    if (directories.length === 0) {
        return files;
    }

    const paths = flatten(await scanDirectories(directories));
    return crawl(
        filterDirectories(paths),
        concat(files, filterFiles(paths))
    );
}

async function readAbstractDocuments(paths: string[]): Promise<IAbstractDocument[]> {
    return Promise.all(paths.map(readAbstractDocument));
}

async function toMap(abstracts: IAbstractDocument[]): Promise<IAbstractDocumentMap> {
    return abstracts.reduce(
        (map: IAbstractDocumentMap, abstract: IAbstractDocument) => map.set(abstract.slug, abstract),
        new Map<string, IAbstractDocument>()
    );
}

export async function readContentDirectory(): Promise<IAbstractDocumentMap> {
    return crawl([path.content], [])
        .then(readAbstractDocuments)
        .then(toMap)
}

export async function readAbstractDocument(fullPath: string): Promise<IAbstractDocument> {
    const file = await parseFile(await fsReadFile(fullPath, 'utf8'));

    return {
        fullPath,
        extension: extname(fullPath),
        slug: getSlug(fullPath),
        excerpt: file.excerpt,
        meta: file.meta
    }
}

export async function readDocument(fullPath: string): Promise<IDocument> {
    const extension = extname(fullPath);
    const file = await parseFile(await fsReadFile(fullPath, 'utf8'));
    const content = await parseContent(extension, file.content);

    return {
        fullPath,
        extension,
        slug: getSlug(fullPath),
        content,
        excerpt: file.excerpt,
        meta: file.meta
    }
}

