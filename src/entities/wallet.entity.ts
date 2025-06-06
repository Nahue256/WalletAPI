import { EntitySchema } from 'typeorm';
import { User } from './user.entity';

export interface Wallet {
  id: string;
  userId: string;
  user: User;
  tag?: string;
  chain: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

export const WalletEntity = new EntitySchema<Wallet>({
  name: 'Wallet',
  tableName: 'wallets',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid'
    },
    userId: {
      type: 'uuid',
      nullable: false,
      name: 'user_id'
    },
    tag: {
      type: String,
      nullable: true
    },
    chain: {
      type: String,
      nullable: false
    },
    address: {
      type: String,
      nullable: false,
      unique: true
    },
    createdAt: {
      type: 'timestamp',
      createDate: true,
      name: 'created_at'
    },
    updatedAt: {
      type: 'timestamp',
      updateDate: true,
      name: 'updated_at'
    }
  },
  relations: {
    user: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: {
        name: 'user_id',
        referencedColumnName: 'id'
      },
      onDelete: 'CASCADE'
    }
  }
}); 