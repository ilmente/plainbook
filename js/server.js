"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify = require("fastify");
const serveStatic = require("serve-static");
const view_1 = require("./view");
class Server {
    constructor(config, content) {
        this.app = fastify();
        this.config = config;
        this.content = content;
    }
    loadAbstractMap() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.content.getAbstractMap();
        });
    }
    mountContentRoutes(map) {
        return __awaiter(this, void 0, void 0, function* () {
            const abstracts = Array.from(map.values());
            return Promise.all(abstracts.map((abstract) => __awaiter(this, void 0, void 0, function* () { return this.setContentHandler(map, abstract); })));
        });
    }
    mountStaticRoutes() {
        return __awaiter(this, void 0, void 0, function* () {
            const routes = Object.keys(this.config.path.static);
            routes.forEach((route) => this.setStaticHandler(route));
        });
    }
    mountServiceRoutes() {
        return __awaiter(this, void 0, void 0, function* () {
            this.setNotFoundHandler();
            this.setErrorHandler();
        });
    }
    setContentHandler(map, abstract) {
        return __awaiter(this, void 0, void 0, function* () {
            const document = yield this.content.getDocument(abstract.path);
            const View = view_1.get(document.meta.view);
            const view = new View(this.config, map, document);
            this.app.get(document.slug, (request, reply) => __awaiter(this, void 0, void 0, function* () { return view.handler(request, reply); }));
        });
    }
    setStaticHandler(route) {
        this.app.use(route, serveStatic(this.config.path.static[route]));
    }
    setNotFoundHandler() {
        const NotFoundView = view_1.getNotFound();
        const notFoundView = new NotFoundView(this.config);
        this.app.setNotFoundHandler((request, reply) => notFoundView.handler(request, reply));
    }
    setErrorHandler() {
        const ErrorView = view_1.getError();
        const errorView = new ErrorView(this.config);
        this.app.setErrorHandler((error, reply) => errorView.handler(error, reply));
    }
    setup() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.loadAbstractMap()
                .then((map) => __awaiter(this, void 0, void 0, function* () { return this.mountContentRoutes(map); }))
                .then(() => __awaiter(this, void 0, void 0, function* () { return this.mountStaticRoutes(); }))
                .then(() => __awaiter(this, void 0, void 0, function* () { return this.mountServiceRoutes(); }));
        });
    }
    listen() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.app.listen(this.config.server.port, this.config.server.host);
            return this.app.server;
        });
    }
}
exports.Server = Server;
