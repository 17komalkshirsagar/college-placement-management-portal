import { applicationService } from '../services/application.service.js';
import { asyncHandler } from '../utils/async-handler.js';
import { ApiError } from '../utils/api-error.js';
import { getRequiredParam } from '../utils/request-param.js';
class ApplicationController {
    apply = asyncHandler(async (req, res) => {
        if (!req.user) {
            throw new ApiError(401, 'Unauthorized');
        }
        const data = await applicationService.applyToJob(req.user.userId, req.body);
        res.status(201).json(data);
    });
    getById = asyncHandler(async (req, res) => {
        if (!req.user) {
            throw new ApiError(401, 'Unauthorized');
        }
        const data = await applicationService.getById(getRequiredParam(req, 'applicationId'), {
            userId: req.user.userId,
            role: req.user.role,
        });
        res.status(200).json(data);
    });
    list = asyncHandler(async (req, res) => {
        if (!req.user) {
            throw new ApiError(401, 'Unauthorized');
        }
        const data = await applicationService.list(req.query, {
            userId: req.user.userId,
            role: req.user.role,
        });
        res.status(200).json(data);
    });
    updateStatus = asyncHandler(async (req, res) => {
        if (!req.user) {
            throw new ApiError(401, 'Unauthorized');
        }
        const data = await applicationService.updateStatus(getRequiredParam(req, 'applicationId'), req.body, {
            userId: req.user.userId,
            role: req.user.role,
        });
        res.status(200).json(data);
    });
}
export const applicationController = new ApplicationController();
