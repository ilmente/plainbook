import * as express from 'express';
import { readDocument, IAbstractDocumentMap } from './content';
import { server } from '../config';

const app = express();

function asyncMiddleware(handler: express.Handler) { 
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
        Promise.resolve(handler(req, res, next)).catch(next);
    }
}

function listening() { 
    console.log(`cms listening on port ${server.port}...`)
}

async function dispatchng(map: IAbstractDocumentMap, url: string): Promise<string> {
    if (!map.has(url)) {
        return '';
    }

    const abstract = map.get(url);
    const document = await readDocument(abstract.fullPath);
    return document.content;
}

export async function serve(map: IAbstractDocumentMap): Promise<void> { 
    app.get('*', asyncMiddleware(
        async (req, res, next) => res.send(await dispatchng(map, req.originalUrl))
    ));

    app.listen(server.port, listening);
}
