import { IUser, UserResponse } from '../interfaces/user.interface';

export const createUser = ({ id, email, password, createdAt = new Date() }: IUser): IUser & { toJSON: () => UserResponse } => {
  const user: IUser = {
    id,
    email,
    password,
    createdAt
  };

  return {
    ...user,
    toJSON: (): UserResponse => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
  };
}; 