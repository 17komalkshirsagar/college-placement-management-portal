import { userService } from '../services/user.service.js';
import { asyncHandler } from '../utils/async-handler.js';
import { getRequiredParam } from '../utils/request-param.js';
class UserController {
    createStudent = asyncHandler(async (req, res) => {
        const data = await userService.createStudentAccount(req.body);
        res.status(201).json(data);
    });
    createCompany = asyncHandler(async (req, res) => {
        const data = await userService.createCompanyAccount(req.body);
        res.status(201).json(data);
    });
    getById = asyncHandler(async (req, res) => {
        const data = await userService.getUserById(getRequiredParam(req, 'userId'));
        res.status(200).json(data);
    });
    list = asyncHandler(async (req, res) => {
        const data = await userService.listUsers(req.query);
        res.status(200).json(data);
    });
    update = asyncHandler(async (req, res) => {
        const data = await userService.updateUser(getRequiredParam(req, 'userId'), req.body);
        res.status(200).json(data);
    });
    softDelete = asyncHandler(async (req, res) => {
        const data = await userService.softDeleteUser(getRequiredParam(req, 'userId'));
        res.status(200).json(data);
    });
}
export const userController = new UserController();
