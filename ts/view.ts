import { ContentView, ContentViewConstructor } from './view/content';
import { NotFoundView, NotFoundViewConstructor } from './view/not-found';
import { ErrorView, ErrorViewConstructor } from './view/error';

export interface ViewRegistry { 
    default: ContentViewConstructor,
    notFound: NotFoundViewConstructor,
    error: ErrorViewConstructor,
    map: Map<string, ContentViewConstructor>
}

const registry: ViewRegistry = {
    default: ContentView,
    notFound: NotFoundView,
    error: ErrorView,
    map: new Map<string, ContentViewConstructor>()
}

export {
    ContentView,
    ContentViewConstructor,
    NotFoundView,
    NotFoundViewConstructor,
    ErrorView,
    ErrorViewConstructor
} 

export function register(name: string, view: ContentViewConstructor, isDefault: boolean = false): ContentViewConstructor {
    if (isDefault) { 
        registry.default = view;
    }

    registry.map.set(name, view);
    return view;
}

export function registerNotFound(view: NotFoundViewConstructor): NotFoundViewConstructor {
    registry.notFound = view;
    return view;
}

export function registerError(view: ErrorViewConstructor): ErrorViewConstructor {
    registry.error = view;
    return view;
}

export function get(name: string): ContentViewConstructor {
    if (registry.map.has(name)) {
        return registry.map.get(name);
    }

    return getDefault();
}

export function getDefault(): ContentViewConstructor {
    return registry.default;
}

export function getNotFound(): NotFoundViewConstructor {
    return registry.notFound;
}

export function getError(): ErrorViewConstructor {
    return registry.error;
}
