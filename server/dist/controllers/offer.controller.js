import { offerService } from '../services/offer.service.js';
import { asyncHandler } from '../utils/async-handler.js';
import { ApiError } from '../utils/api-error.js';
import { getRequiredParam } from '../utils/request-param.js';
class OfferController {
    create = asyncHandler(async (req, res) => {
        if (!req.user) {
            throw new ApiError(401, 'Unauthorized');
        }
        const data = await offerService.createOffer(req.body, {
            userId: req.user.userId,
            role: req.user.role,
        });
        res.status(201).json(data);
    });
    respond = asyncHandler(async (req, res) => {
        if (!req.user) {
            throw new ApiError(401, 'Unauthorized');
        }
        const data = await offerService.respondOffer(getRequiredParam(req, 'offerId'), req.body, req.user.userId);
        res.status(200).json(data);
    });
}
export const offerController = new OfferController();
