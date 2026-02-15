import type { Request, Response } from 'express';

import { offerService } from '../services/offer.service.js';
import { asyncHandler } from '../utils/async-handler.js';
import { ApiError } from '../utils/api-error.js';
import { getRequiredParam } from '../utils/request-param.js';

class OfferController {
  public create = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, 'Unauthorized');
    }

    const data = await offerService.createOffer(req.body, {
      userId: req.user.userId,
      role: req.user.role,
    });
    res.status(201).json(data);
  });

  public respond = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, 'Unauthorized');
    }

    const data = await offerService.respondOffer(getRequiredParam(req, 'offerId'), req.body, req.user.userId);
    res.status(200).json(data);
  });
}

export const offerController = new OfferController();
