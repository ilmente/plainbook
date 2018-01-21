import { ServerReply } from '../server';
import { Config } from '../config';

export type ErrorViewConstructor = new (Config) => ErrorView

export class ErrorView {
    protected readonly config: Config

    constructor(config: Config) {
        this.config = config;
    }

    async handler(error: Error, reply: ServerReply): Promise<void> {
        const view = await this.render(error);
        console.error(error);

        reply
            .type('text/html')
            .code(500)
            .send(view);
    }

    async render(error: any): Promise<string> {
        return `
            <h1>500 - Whoops! Something went wrong...</h1>
            <ul>
                <li><small>${error}</small></li>
            </ul>
        `;
    }
}
