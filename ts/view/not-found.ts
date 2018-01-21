import { ServerRequest, ServerReply } from '../server';
import { Config } from '../config';

export type NotFoundViewConstructor = new (Config) => NotFoundView

export class NotFoundView {
    protected readonly config: Config

    constructor(config: Config) {
        this.config = config;
    }

    async handler(request: ServerRequest, reply: ServerReply): Promise<void> {
        const view = await this.render();

        reply
            .type('text/html')
            .code(404)
            .send(view);
    }

    async render(): Promise<string> {
        return `
            <h1>404 - Whoops! Page not found...</h1>
        `;
    }
}
