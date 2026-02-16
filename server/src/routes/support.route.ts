import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../utils/async-handler.js';
import { supportService } from '../services/support.service.js';

const router = Router();

router.post(
  '/',
  asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newMessage = await supportService.createMessage(name, email, subject, message);

    return res.status(201).json({
      message: 'Support message sent successfully',
      data: newMessage,
    });
  })
);

router.get(
  '/',
  asyncHandler(async (_req: Request, res: Response, _next: NextFunction) => {
    const messages = await supportService.getAllMessages();

    return res.status(200).json({
      message: 'Support messages retrieved successfully',
      data: messages,
    });
  })
);

router.patch(
  '/:id/status',
  asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    const statusInput = req.body.status;

    if (typeof statusInput !== 'string') {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const status: string = statusInput || 'pending';
    const validStatuses = ['pending', 'responded', 'closed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updatedMessage = await supportService.updateMessageStatus(id, status);

    if (!updatedMessage) {
      return res.status(404).json({ message: 'Message not found' });
    }

    return res.status(200).json({
      message: 'Status updated successfully',
      data: updatedMessage,
    });
  })
);

export default router;
