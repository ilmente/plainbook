import { Server as HttpServer } from 'http';
import { config as getConfig, PartialConfig } from './config';
import { Crawler } from './crawler';
import { Parser } from './parser';
import { Content } from './content';
import { Server } from './server';

export async function bootstrap(partialConfig?: PartialConfig): Promise<HttpServer> {
    const config = getConfig(partialConfig);
    const crawler = new Crawler(config);
    const parser = new Parser(config);
    const content = new Content(config, crawler, parser);
    const server = new Server(config, content);
    return server.setup()
        .then(() => server.listen());
}
