import { ServerRequest, ServerReply } from '../server';
import { AbstractMap, Document } from '../content';
import { Config } from '../config';

export type ContentViewConstructor = new (Config, AbstractMap, Document) => ContentView

export class ContentView {
    protected readonly config: Config
    protected readonly map: AbstractMap
    protected readonly document: Document

    constructor(config: Config, map: AbstractMap, document: Document) {
        this.config = config;
        this.map = map;
        this.document = document;
    }

    async handler(request: ServerRequest, reply: ServerReply): Promise<void> {
        const view = await this.render();

        reply
            .type('text/html')
            .code(200)
            .send(view);
    }

    async render(): Promise<string> {
        return this.document.content;
    }
}
