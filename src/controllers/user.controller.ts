import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service';
import { UserCreateInput, UserUpdateInput } from '../interfaces/user.interface';

export const createUser = async (
  req: Request<{}, {}, UserCreateInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.json({
      status: 'success',
      data: { user }
    });
  } catch (error: any) {
    if(error.message === 'User not found') {
      res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    next(error);
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await userService.getAllUsers();
    res.json({
      status: 'success',
      data: { users }
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: Request<{ id: string }, {}, UserUpdateInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    res.json({
      status: 'User successfully updated',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    await userService.deleteUser(req.params.id);
    res.json({
      status: 'User successfully deleted'
    });
  } catch (error) {
    next(error);
  }
}; 