import { Wallet } from '../entities/wallet.entity';

export interface WalletCreateInput {
  tag?: string;
  chain: string;
  address: string;
}

export interface WalletUpdateInput {
  tag?: string;
  chain?: string;
  address?: string;
}

export type WalletResponse = Omit<Wallet, 'user'> & {
  userId: string;
}; 