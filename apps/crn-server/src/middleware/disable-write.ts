import { Request, Response, NextFunction } from 'express';

export const disableWriteMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.method === 'PUT' || req.method === 'POST' || req.method === 'PATCH') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  return next();
};
