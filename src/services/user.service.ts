import { IUser, UserCreateInput, UserUpdateInput } from '../interfaces/user.interface';
import * as userRepository from '../repositories/user.repository';
import { hashPassword } from '../utils/password.util';

export const createUser = async (userData: UserCreateInput): Promise<IUser> => {
  const existingUserEmail = await userRepository.findByEmail(userData.email);
  if (existingUserEmail) {
    throw new Error('User with this email already exists');
  }

  // Hash the password before saving
  const hashedPassword = await hashPassword(userData.password);
  const userWithHashedPassword = {
    ...userData,
    password: hashedPassword
  };

  return userRepository.create(userWithHashedPassword);
};

export const getUserById = async (id: string): Promise<IUser> => {
  const user = await userRepository.findById(id);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

export const getAllUsers = async (): Promise<IUser[]> => {
  return userRepository.findAll();
};

export const updateUser = async (id: string, userData: UserUpdateInput): Promise<IUser> => {
  // If password is being updated, hash it
  if (userData.password) {
    userData.password = await hashPassword(userData.password);
  }

  const updatedUser = await userRepository.update(id, userData);
  if (!updatedUser) {
    throw new Error('User not found');
  }
  return updatedUser;
};

export const deleteUser = async (id: string): Promise<boolean> => {
  const deleted = await userRepository.remove(id);
  if (!deleted) {
    throw new Error('User not found');
  }
  return true;
}; 