import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { generateToken } from '../middleware/auth';
import { validate } from 'class-validator';

export class AuthController {
  private userRepository = AppDataSource.getRepository(User);

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { first_name, last_name, email, password, role } = req.body;

      // Check if user already exists
      const existingUser = await this.userRepository.findOne({
        where: { email },
      });

      if (existingUser) {
        res.status(409).json({
          success: false,
          message: 'User with this email already exists',
        });
        return;
      }

      // Hash password
      const saltRounds = 12;
      const password_hash = await bcrypt.hash(password, saltRounds);

      // Create new user
      const user = this.userRepository.create({
        first_name,
        last_name,
        email,
        password_hash,
        role: role || 'viewer',
      });

      // Validate user data
      const errors = await validate(user);
      if (errors.length > 0) {
        res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.map(error => ({
            property: error.property,
            constraints: error.constraints,
          })),
        });
        return;
      }

      // Save user
      const savedUser = await this.userRepository.save(user);

      // Generate token
      const token = generateToken({
        id: savedUser.id,
        email: savedUser.email,
      });

      // Remove password from response
      const { password_hash: _, ...userResponse } = savedUser;

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: userResponse,
          token,
          expires_in: process.env.JWT_EXPIRES_IN || '24h',
        },
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during registration',
      });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({
          success: false,
          message: 'Email and password are required',
        });
        return;
      }

      // Find user by email
      const user = await this.userRepository.findOne({
        where: { email },
      });

      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Invalid credentials',
        });
        return;
      }

      // Check if user is active
      if (!user.is_active) {
        res.status(401).json({
          success: false,
          message: 'Account is deactivated',
        });
        return;
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);

      if (!isPasswordValid) {
        res.status(401).json({
          success: false,
          message: 'Invalid credentials',
        });
        return;
      }

      // Update last login time
      user.last_login_at = new Date();
      await this.userRepository.save(user);

      // Generate token
      const token = generateToken({
        id: user.id,
        email: user.email,
      });

      // Remove password from response
      const { password_hash: _, ...userResponse } = user;

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: userResponse,
          token,
          expires_in: process.env.JWT_EXPIRES_IN || '24h',
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during login',
      });
    }
  }

  async getProfile(req: any, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
        return;
      }

      const user = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found',
        });
        return;
      }

      // Remove password from response
      const { password_hash: _, ...userResponse } = user;

      res.json({
        success: true,
        data: { user: userResponse },
      });
    } catch (error) {
      console.error('Profile fetch error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  async updateProfile(req: any, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { first_name, last_name } = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
        return;
      }

      const user = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found',
        });
        return;
      }

      // Update user data
      if (first_name) user.first_name = first_name;
      if (last_name) user.last_name = last_name;

      const savedUser = await this.userRepository.save(user);

      // Remove password from response
      const { password_hash: _, ...userResponse } = savedUser;

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: { user: userResponse },
      });
    } catch (error) {
      console.error('Profile update error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  async changePassword(req: any, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { current_password, new_password } = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
        return;
      }

      if (!current_password || !new_password) {
        res.status(400).json({
          success: false,
          message: 'Current password and new password are required',
        });
        return;
      }

      const user = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found',
        });
        return;
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(
        current_password,
        user.password_hash
      );

      if (!isCurrentPasswordValid) {
        res.status(401).json({
          success: false,
          message: 'Current password is incorrect',
        });
        return;
      }

      // Hash new password
      const saltRounds = 12;
      const new_password_hash = await bcrypt.hash(new_password, saltRounds);

      // Update password
      user.password_hash = new_password_hash;
      await this.userRepository.save(user);

      res.json({
        success: true,
        message: 'Password changed successfully',
      });
    } catch (error) {
      console.error('Password change error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
}