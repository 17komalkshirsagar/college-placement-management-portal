import Application from '../models/Application.model.js';
import Company from '../models/Company.model.js';
import Job from '../models/Job.model.js';
import Offer from '../models/Offer.model.js';
import Student from '../models/Student.model.js';
import { ApiError } from '../utils/api-error.js';
import { ensureObjectId } from '../utils/object-id.js';
import type { CreateOfferDto, RespondOfferDto } from '../validators/offer.validator.js';

class OfferService {
  public async createOffer(payload: CreateOfferDto, actor: { userId: string; role: string }) {
    ensureObjectId(payload.applicationId, 'application id');

    const application = (await Application.findById(payload.applicationId).populate('job').populate('student').lean()) as unknown as {
      job: { company: { toString: () => string } };
    } | null;
    if (!application) {
      throw new ApiError(404, 'Application not found');
    }

    const existingOffer = await Offer.findOne({ application: payload.applicationId }).lean();
    if (existingOffer) {
      throw new ApiError(409, 'An offer already exists for this application');
    }

    if (actor.role === 'company') {
      const company = await Company.findOne({ user: actor.userId }).lean();
      if (!company || company._id.toString() !== application.job.company.toString()) {
        throw new ApiError(403, 'Forbidden');
      }
    }

    const offer = await Offer.create({
      application: payload.applicationId,
      offeredCtc: payload.offeredCtc,
      joiningDate: new Date(payload.joiningDate),
      offerStatus: 'pending',
    });

    await Application.findByIdAndUpdate(payload.applicationId, { status: 'selected' });

    return { id: offer._id.toString(), message: 'Offer created successfully' };
  }

  public async respondOffer(offerId: string, payload: RespondOfferDto, actorUserId: string) {
    ensureObjectId(offerId, 'offer id');

    const offer = await Offer.findById(offerId).populate({ path: 'application', populate: { path: 'student' } });
    if (!offer) {
      throw new ApiError(404, 'Offer not found');
    }

    const student = await Student.findOne({ user: actorUserId }).lean();
    const application = offer.application as unknown as { student: { _id: { toString: () => string } }; _id: string };

    if (!student || student._id.toString() !== application.student._id.toString()) {
      throw new ApiError(403, 'Only the applied student can respond to this offer');
    }

    offer.offerStatus = payload.action;
    await offer.save();

    if (payload.action === 'accepted') {
      await Application.findByIdAndUpdate(application._id, { status: 'selected' });
    }

    return offer.toObject();
  }
}

export const offerService = new OfferService();
