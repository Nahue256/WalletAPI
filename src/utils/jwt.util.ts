import jwt from 'jsonwebtoken';
import { IUser } from '../interfaces/user.interface';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const TOKEN_EXPIRATION = '24h';

export const generateToken = (user: IUser): string => {
  return jwt.sign(
    { 
      id: user.id,
      email: user.email 
    },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRATION }
  );
};

export const verifyToken = (token: string): jwt.JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
};

export const extractToken = (authHeader: string | undefined): string | null => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.split(' ')[1];
}; 