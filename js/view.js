"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const content_1 = require("./view/content");
exports.ContentView = content_1.ContentView;
const not_found_1 = require("./view/not-found");
exports.NotFoundView = not_found_1.NotFoundView;
const error_1 = require("./view/error");
exports.ErrorView = error_1.ErrorView;
const registry = {
    default: content_1.ContentView,
    notFound: not_found_1.NotFoundView,
    error: error_1.ErrorView,
    map: new Map()
};
function register(name, view, isDefault = false) {
    if (isDefault) {
        registry.default = view;
    }
    registry.map.set(name, view);
    return view;
}
exports.register = register;
function registerNotFound(view) {
    registry.notFound = view;
    return view;
}
exports.registerNotFound = registerNotFound;
function registerError(view) {
    registry.error = view;
    return view;
}
exports.registerError = registerError;
function get(name) {
    if (registry.map.has(name)) {
        return registry.map.get(name);
    }
    return getDefault();
}
exports.get = get;
function getDefault() {
    return registry.default;
}
exports.getDefault = getDefault;
function getNotFound() {
    return registry.notFound;
}
exports.getNotFound = getNotFound;
function getError() {
    return registry.error;
}
exports.getError = getError;
