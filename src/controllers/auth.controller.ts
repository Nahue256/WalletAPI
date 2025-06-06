import { Request, Response, NextFunction } from 'express';
import * as userRepository from '../repositories/user.repository';
import { verifyPassword } from '../utils/password.util';
import { generateToken } from '../utils/jwt.util';
import { AuthRequest } from '../middleware/auth.middleware';

interface SignInRequest {
  email: string;
  password: string;
}

export const signIn = async (
  req: Request<{}, {}, SignInRequest>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user with complete data (including password)
    const user = await userRepository.findByEmailWithPassword(email);
    if (!user) {
      res.status(401).json({
        status: 'error',
        message: 'User not found'
      });
      return;
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
      return;
    }

    // Generate token
    const token = generateToken(user);

    res.status(200).json({
      status: 'success',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const signOut = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // In a stateless JWT implementation, we don't need to do anything server-side
    // The client should remove the token from their storage
    res.status(200).json({
      status: 'success',
      message: 'Successfully signed out'
    });
  } catch (error) {
    next(error);
  }
}; 