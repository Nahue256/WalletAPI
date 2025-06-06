import { AppDataSource } from '../config/database';
import { User, UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { hashPassword } from '../utils/password.util';

export const getUserRepository = (): Repository<User> => {
  return AppDataSource.getRepository(UserEntity);
};

export const createTestUser = async (userData: Partial<User> = {}): Promise<User> => {
  const repository = getUserRepository();

  // Hash the password if it exists
  if (userData.password) {
    userData = {
      ...userData,
      password: await hashPassword(userData.password)
    };
  }

  const user = await repository.save({
    ...userData
  });

  return user;
};

export const createMultipleTestUsers = async (userData: Partial<User> = {}): Promise<User[]> => {
  const repository = getUserRepository();
  const defaultUser = {
    username: `testuser_1`,
    email: `test_1@example.com`,
    password: 'password123'
  };
  const defaultUser2 = {
    username: `testuser_2`,
    email: `test_2@example.com`,
    password: 'password123'
  };
  const defaultUser3 = {
    username: `testuser_3`,
    email: `test_3@example.com`,
    password: 'password123'
  };

  // Hash passwords for all users
  const user1Data = { ...defaultUser, ...userData };
  const user2Data = { ...defaultUser2, ...userData };
  const user3Data = { ...defaultUser3, ...userData };

  if (user1Data.password) user1Data.password = await hashPassword(user1Data.password);
  if (user2Data.password) user2Data.password = await hashPassword(user2Data.password);
  if (user3Data.password) user3Data.password = await hashPassword(user3Data.password);

  const user = await repository.save(user1Data);
  const user2 = await repository.save(user2Data);
  const user3 = await repository.save(user3Data);

  return [user, user2, user3];
}; 