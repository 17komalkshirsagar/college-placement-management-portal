import type { NextFunction, Request, Response } from 'express';

export type AsyncController = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export function asyncHandler(controller: AsyncController) {
  return (req: Request, res: Response, next: NextFunction): void => {
    controller(req, res, next).catch(next);
  };
}
