import { readContentDirectory } from './lib/content';
import { serve } from './lib/server';
import { path } from './config';

export async function bootstrap(): Promise<void> {
    readContentDirectory().then(serve)
}

bootstrap().catch(err => {
    console.error(err);
});





