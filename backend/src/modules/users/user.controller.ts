import { Request, Response, NextFunction } from 'express';
import { User } from './user.model.js';

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let user = await User.findOne({ isDeleted: false });
    
    if (!user) {
      user = await User.create({
        name: 'Business Owner',
        email: 'owner@gstmate.pro',
        role: 'owner',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let user = await User.findOne({ isDeleted: false });
    
    if (!user) {
      const error: any = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    const updatedUser = await User.findByIdAndUpdate(user._id, req.body, { 
      new: true,
      runValidators: true 
    });

    res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};
