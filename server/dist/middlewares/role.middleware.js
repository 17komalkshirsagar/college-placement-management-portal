import { ApiError } from '../utils/api-error.js';
export function roleMiddleware(...roles) {
    return (req, _res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            throw new ApiError(403, 'Forbidden');
        }
        next();
    };
}
