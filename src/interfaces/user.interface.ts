import { User } from '../entities/user.entity';

export interface IUser {
  id: string;
  email: string;
  password?: string;
  createdAt: Date;
}

export type UserCreateInput = Omit<User, 'id' | 'createdAt'>;
export type UserUpdateInput = Partial<UserCreateInput>;
export type UserResponse = Omit<User, 'password'>; 