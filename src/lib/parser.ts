import * as parseFrontMatter from 'gray-matter';
import * as parseMarkdown from 'marked';

export interface IFile { 
    content: string
    excerpt: string
    meta: any
}

export async function parseFile(rawFile: string): Promise<IFile> {
    const file = parseFrontMatter(rawFile);

    return {
        content: file.content,
        excerpt: file.excerpt,
        meta: file.data
    }
}

export async function parseContent(extension: string, content: string): Promise<string> { 
    if (extension === '.html') { 
        return content;
    }
    
    return parseMarkdown(content);
}
