import { resolve } from 'path';

export const server = {
    port: 3000,
    staticPath: '/static'
}

export const path = {
    content: resolve('./content'),
    view: resolve('./view'),
    static: resolve('./static')
}

export const content = {
    extensions: ['.html', '.md']
}
