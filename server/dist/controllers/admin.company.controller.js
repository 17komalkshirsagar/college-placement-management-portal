import { companyService } from '../services/company.service.js';
import { asyncHandler } from '../utils/async-handler.js';
import { getRequiredParam } from '../utils/request-param.js';
class AdminCompanyController {
    getCompany = asyncHandler(async (req, res) => {
        const companyId = getRequiredParam(req, 'companyId');
        const data = await companyService.adminGetCompany(companyId);
        res.status(200).json(data);
    });
    updateCompany = asyncHandler(async (req, res) => {
        const companyId = getRequiredParam(req, 'companyId');
        const payload = req.body;
        const data = await companyService.adminUpdateCompany(companyId, payload);
        res.status(200).json(data);
    });
    updateStatus = asyncHandler(async (req, res) => {
        const companyId = getRequiredParam(req, 'companyId');
        const payload = req.body;
        const data = await companyService.adminUpdateStatus(companyId, payload);
        res.status(200).json(data);
    });
    deleteCompany = asyncHandler(async (req, res) => {
        const companyId = getRequiredParam(req, 'companyId');
        const data = await companyService.adminDeleteCompany(companyId);
        res.status(200).json(data);
    });
}
export const adminCompanyController = new AdminCompanyController();
