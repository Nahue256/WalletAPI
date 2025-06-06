import { Repository } from 'typeorm';
import { Wallet, WalletEntity } from '../entities/wallet.entity';
import { WalletCreateInput, WalletUpdateInput } from '../interfaces/wallet.interface';
import { AppDataSource } from '../config/database';

const walletRepository: Repository<Wallet> = AppDataSource.getRepository(WalletEntity);

export const create = async (userId: string, walletData: WalletCreateInput): Promise<Wallet> => {
  const wallet = await walletRepository.save({
    ...walletData,
    userId
  });
  return wallet;
};

export const findById = async (id: string): Promise<Wallet | null> => {
  return walletRepository.findOne({
    where: { id },
    relations: ['user']
  });
};

export const findByUserId = async (userId: string): Promise<Wallet[]> => {
  return walletRepository.find({
    where: { userId },
    relations: ['user']
  });
};

export const findByAddress = async (address: string): Promise<Wallet | null> => {
  return walletRepository.findOne({
    where: { address },
    relations: ['user']
  });
};

export const update = async (id: string, walletData: WalletUpdateInput): Promise<Wallet | null> => {
  const wallet = await walletRepository.findOneBy({ id });
  if (!wallet) return null;

  const updatedWallet = await walletRepository.save({
    ...wallet,
    ...walletData
  });

  return updatedWallet;
};

export const remove = async (id: string): Promise<boolean> => {
  const result = await walletRepository.delete(id);
  return result.affected ? result.affected > 0 : false;
}; 