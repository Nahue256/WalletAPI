import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractToken } from '../utils/jwt.util';

export interface AuthRequest<P = {}, ResBody = {}, ReqBody = {}> extends Request<P, ResBody, ReqBody> {
  user?: {
    id: string;
    email: string;
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const token = extractToken(req.headers.authorization);
    console.log(req.headers);
    
    if (!token) {
      res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
      return;
    }

    const decoded = verifyToken(token);
    req.user = {
      id: decoded.id as string,
      email: decoded.email as string
    };
    
    next();
  } catch (error) {
    res.status(401).json({
      status: 'error',
      message: 'Invalid or expired token'
    });
  }
}; 