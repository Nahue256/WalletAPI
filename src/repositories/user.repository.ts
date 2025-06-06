import { Repository } from 'typeorm';
import { User, UserEntity, createUser, sanitizeUser } from '../entities/user.entity';
import { UserCreateInput, UserUpdateInput } from '../interfaces/user.interface';
import { AppDataSource } from '../config/database';

type SafeUser = Omit<User, 'password'>;
const userRepository: Repository<User> = AppDataSource.getRepository(UserEntity);

export const create = async (userData: UserCreateInput): Promise<SafeUser> => {
  const user = createUser(userData);
  const savedUser = await userRepository.save(user);
  return sanitizeUser(savedUser);
};

export const findById = async (id: string): Promise<SafeUser | null> => {
  const user = await userRepository.findOneBy({ id });
  return user ? sanitizeUser(user) : null;
};

export const findByEmail = async (email: string): Promise<SafeUser | null> => {
  const user = await userRepository.findOneBy({ email });
  return user ? sanitizeUser(user) : null;
};

export const findByEmailWithPassword = async (email: string): Promise<User | null> => {
  return userRepository.findOneBy({ email });
};

export const findAll = async (): Promise<SafeUser[]> => {
  const users = await userRepository.find();
  return users.map(sanitizeUser);
};

export const update = async (id: string, userData: UserUpdateInput): Promise<SafeUser | null> => {
  const user = await userRepository.findOneBy({ id });
  if (!user) return null;

  const updatedUser = await userRepository.save({
    ...user,
    ...userData
  });

  return sanitizeUser(updatedUser);
};

export const remove = async (id: string): Promise<boolean> => {
  const result = await userRepository.delete(id);
  return result.affected ? result.affected > 0 : false;
}; 