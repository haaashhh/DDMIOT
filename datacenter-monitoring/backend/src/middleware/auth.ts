import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Access token required',
    });
    return;
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET || 'your-secret-key',
    (err: any, user: any) => {
      if (err) {
        res.status(403).json({
          success: false,
          message: 'Invalid or expired token',
        });
        return;
      }

      req.user = user;
      next();
    }
  );
};

export const optionalAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    next();
    return;
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET || 'your-secret-key',
    (err: any, user: any) => {
      if (!err) {
        req.user = user;
      }
      next();
    }
  );
};

export const generateToken = (payload: { id: string; email: string }): string => {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};