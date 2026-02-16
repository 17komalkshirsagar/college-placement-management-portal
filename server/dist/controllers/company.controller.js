import { companyService } from '../services/company.service.js';
import { asyncHandler } from '../utils/async-handler.js';
import { ApiError } from '../utils/api-error.js';
import { getRequiredParam } from '../utils/request-param.js';
class CompanyController {
    update = asyncHandler(async (req, res) => {
        if (!req.user) {
            throw new ApiError(401, 'Unauthorized');
        }
        const data = await companyService.updateProfile(getRequiredParam(req, 'companyId'), req.body, {
            userId: req.user.userId,
            role: req.user.role,
        });
        res.status(200).json(data);
    });
    setActivation = asyncHandler(async (req, res) => {
        const data = await companyService.updateActivation(getRequiredParam(req, 'companyId'), req.body);
        res.status(200).json(data);
    });
    list = asyncHandler(async (req, res) => {
        const data = await companyService.listCompanies(req.query);
        res.status(200).json(data);
    });
}
export const companyController = new CompanyController();
