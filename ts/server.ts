import * as fastify from 'fastify';
import * as serveStatic from 'serve-static';
import { Server as HttpServer, IncomingMessage, ServerResponse } from 'http';
import { Content, Abstract, AbstractMap } from './content';
import { get as getView, getNotFound as getNotFoundView, getError as getErrorView } from './view';
import { Config } from './config';

export type ServerConstructor = new (AbstractMap) => Server
export type ServerApplication = fastify.FastifyInstance<HttpServer, IncomingMessage, ServerResponse>
export type ServerRequest = fastify.FastifyRequest<IncomingMessage>
export type ServerReply = fastify.FastifyReply<ServerResponse>

export class Server {
    protected readonly app: ServerApplication
    protected readonly config: Config
    protected readonly content: Content

    constructor(config: Config, content: Content) {
        this.app = fastify();
        this.config = config;
        this.content = content;
    }

    protected async loadAbstractMap(): Promise<AbstractMap> { 
        return this.content.getAbstractMap();
    }

    protected async mountContentRoutes(map: AbstractMap): Promise<void[]> {
        const abstracts = Array.from(map.values());
        return Promise.all(abstracts.map(async (abstract: Abstract) => this.setContentHandler(map, abstract)));
    }

    protected async mountStaticRoutes(): Promise<void> {
        const routes = Object.keys(this.config.path.static);
        routes.forEach((route: string) => this.setStaticHandler(route));
    }

    protected async mountServiceRoutes(): Promise<void> {
        this.setNotFoundHandler();
        this.setErrorHandler();
    }

    protected async setContentHandler(map: AbstractMap, abstract: Abstract): Promise<void> {
        const document = await this.content.getDocument(abstract.path);
        const View = getView(document.meta.view);
        const view = new View(this.config, map, document);
        this.app.get(document.slug, async (request: ServerRequest, reply: ServerReply) => view.handler(request, reply));
    }

    protected setStaticHandler(route: string): void {
        this.app.use(route, serveStatic(this.config.path.static[route]));
    }

    protected setNotFoundHandler(): void { 
        const NotFoundView = getNotFoundView();
        const notFoundView = new NotFoundView(this.config);
        this.app.setNotFoundHandler((request: ServerRequest, reply: ServerReply) => notFoundView.handler(request, reply));
    }

    protected setErrorHandler(): void {
        const ErrorView = getErrorView();
        const errorView = new ErrorView(this.config);
        this.app.setErrorHandler((error: Error, reply: ServerReply) => errorView.handler(error, reply));
    }

    async setup(): Promise<void> {
        return this.loadAbstractMap()
            .then(async (map: AbstractMap) => this.mountContentRoutes(map))
            .then(async () => this.mountStaticRoutes())
            .then(async () => this.mountServiceRoutes());
    }

    async listen(): Promise<HttpServer> {
        await this.app.listen(this.config.server.port, this.config.server.host);
        return this.app.server;
    }
}
