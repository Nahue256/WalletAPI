import { Request, Response, NextFunction } from 'express';
import * as walletService from '../services/wallet.service';
import { WalletCreateInput, WalletUpdateInput } from '../interfaces/wallet.interface';
import { AuthRequest } from '../middleware/auth.middleware';

export const createWallet = async (
  req: AuthRequest<{}, {}, WalletCreateInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
      return;
    }

    const wallet = await walletService.createWallet(req.user.id, req.body);
    res.status(201).json({
      status: 'success',
      data: { wallet }
    });
  } catch (error: any) {
    if (error.message === 'Wallet with this address already exists') {
      res.status(400).json({
        status: 'error',
        message: error.message
      });
      return;
    }
    next(error);
  }
};

export const getWallet = async (
  req: AuthRequest<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
      return;
    }

    const wallet = await walletService.getWalletById(req.params.id, req.user.id);
    res.json({
      status: 'success',
      data: { wallet }
    });
  } catch (error: any) {
    if (error.message === 'Wallet not found') {
      res.status(404).json({
        status: 'error',
        message: error.message
      });
      return;
    }
    if (error.message === 'Unauthorized access to wallet') {
      res.status(403).json({
        status: 'error',
        message: error.message
      });
      return;
    }
    next(error);
  }
};

export const getAllWallets = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
      return;
    }

    const wallets = await walletService.getWalletsByUserId(req.user.id);
    res.json({
      status: 'success',
      data: { wallets }
    });
  } catch (error) {
    next(error);
  }
};

export const updateWallet = async (
  req: AuthRequest<{ id: string }, {}, WalletUpdateInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
      return;
    }

    const wallet = await walletService.updateWallet(req.params.id, req.user.id, req.body);
    res.json({
      status: 'success',
      data: { wallet }
    });
  } catch (error: any) {
    if (error.message === 'Wallet not found') {
      res.status(404).json({
        status: 'error',
        message: error.message
      });
      return;
    }
    if (error.message === 'Unauthorized access to wallet') {
      res.status(403).json({
        status: 'error',
        message: error.message
      });
      return;
    }
    if (error.message === 'Wallet with this address already exists') {
      res.status(400).json({
        status: 'error',
        message: error.message
      });
      return;
    }
    next(error);
  }
};

export const deleteWallet = async (
  req: AuthRequest<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
      return;
    }

    await walletService.deleteWallet(req.params.id, req.user.id);
    res.json({
      status: 'success',
      message: 'Wallet successfully deleted'
    });
  } catch (error: any) {
    if (error.message === 'Wallet not found') {
      res.status(404).json({
        status: 'error',
        message: error.message
      });
      return;
    }
    if (error.message === 'Unauthorized access to wallet') {
      res.status(403).json({
        status: 'error',
        message: error.message
      });
      return;
    }
    next(error);
  }
}; 