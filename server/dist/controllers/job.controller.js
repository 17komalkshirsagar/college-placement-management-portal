import { jobService } from '../services/job.service.js';
import { asyncHandler } from '../utils/async-handler.js';
import { ApiError } from '../utils/api-error.js';
import { getRequiredParam } from '../utils/request-param.js';
class JobController {
    create = asyncHandler(async (req, res) => {
        if (!req.user)
            throw new ApiError(401, 'Unauthorized');
        const data = await jobService.createJob(req.user.userId, req.body);
        res.status(201).json(data);
    });
    update = asyncHandler(async (req, res) => {
        if (!req.user)
            throw new ApiError(401, 'Unauthorized');
        const data = await jobService.updateJob(getRequiredParam(req, 'jobId'), req.body, {
            userId: req.user.userId,
            role: req.user.role,
        });
        res.status(200).json(data);
    });
    close = asyncHandler(async (req, res) => {
        if (!req.user)
            throw new ApiError(401, 'Unauthorized');
        const data = await jobService.closeJob(getRequiredParam(req, 'jobId'), {
            userId: req.user.userId,
            role: req.user.role,
        });
        res.status(200).json(data);
    });
    delete = asyncHandler(async (req, res) => {
        if (!req.user)
            throw new ApiError(401, 'Unauthorized');
        const data = await jobService.deleteJob(getRequiredParam(req, 'jobId'), {
            userId: req.user.userId,
            role: req.user.role,
        });
        res.status(200).json(data);
    });
    list = asyncHandler(async (req, res) => {
        const data = await jobService.listJobs(req.query);
        res.status(200).json(data);
    });
}
export const jobController = new JobController();
