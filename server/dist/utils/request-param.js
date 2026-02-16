import { ApiError } from './api-error.js';
export function getRequiredParam(req, key) {
    const value = req.params[key];
    if (!value) {
        throw new ApiError(400, `Missing required route parameter: ${key}`);
    }
    return value;
}
