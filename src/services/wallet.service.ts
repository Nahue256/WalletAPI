import { Wallet } from '../entities/wallet.entity';
import * as walletRepository from '../repositories/wallet.repository';
import { WalletCreateInput, WalletUpdateInput } from '../interfaces/wallet.interface';

export const createWallet = async (userId: string, walletData: WalletCreateInput): Promise<Wallet> => {
  // Check if wallet address already exists
  const existingWallet = await walletRepository.findByAddress(walletData.address);
  if (existingWallet) {
    throw new Error('Wallet with this address already exists');
  }

  return walletRepository.create(userId, walletData);
};

export const getWalletById = async (id: string, userId: string): Promise<Wallet> => {
  const wallet = await walletRepository.findById(id);
  if (!wallet) {
    throw new Error('Wallet not found');
  }
  
  // Ensure wallet belongs to user
  if (wallet.userId !== userId) {
    throw new Error('Unauthorized access to wallet');
  }

  return wallet;
};

export const getWalletsByUserId = async (userId: string): Promise<Wallet[]> => {
  return walletRepository.findByUserId(userId);
};

export const updateWallet = async (id: string, userId: string, walletData: WalletUpdateInput): Promise<Wallet> => {
  // Check if wallet exists and belongs to user
  const wallet = await walletRepository.findById(id);
  if (!wallet) {
    throw new Error('Wallet not found');
  }
  
  if (wallet.userId !== userId) {
    throw new Error('Unauthorized access to wallet');
  }

  // If address is being updated, check if new address already exists
  if (walletData.address) {
    const existingWallet = await walletRepository.findByAddress(walletData.address);
    if (existingWallet && existingWallet.id !== id) {
      throw new Error('Wallet with this address already exists');
    }
  }

  const updatedWallet = await walletRepository.update(id, walletData);
  if (!updatedWallet) {
    throw new Error('Failed to update wallet');
  }

  return updatedWallet;
};

export const deleteWallet = async (id: string, userId: string): Promise<void> => {
  // Check if wallet exists and belongs to user
  const wallet = await walletRepository.findById(id);
  if (!wallet) {
    throw new Error('Wallet not found');
  }
  
  if (wallet.userId !== userId) {
    throw new Error('Unauthorized access to wallet');
  }

  const success = await walletRepository.remove(id);
  if (!success) {
    throw new Error('Failed to delete wallet');
  }
}; 