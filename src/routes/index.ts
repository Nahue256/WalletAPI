import { Router, Request, Response } from 'express';
import userRoutes from './user.routes';
import authRoutes from './auth.routes';
import walletRoutes from './wallet.routes';

const router = Router();

const welcomeHandler = (req: Request, res: Response): void => {
  res.json({
    status: 'success',
    message: 'Welcome to the Wallet API'
  });
};

// Routes
router.get('/', welcomeHandler);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/wallets', walletRoutes);

export default router; 