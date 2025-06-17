import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";
import Token from "../models/token";

// Extend Express Request interface to include userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}
import {
  createAccessToken,
  createRefreshToken,
  sendRefreshToken,
} from "../utils/jwt";
import { generateRandomToken } from "../utils/crypto";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "../utils/email";

// Signup
export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "Email already in use" });
      return;
    }

    const user = await User.create({ name, email, password });

    const verificationToken = await generateRandomToken();
    await Token.create({
      token: verificationToken,
      userId: user._id,
      type: "verify",
      expiresAt: new Date(Date.now() + 3600000), // 1 hour
    });

    await sendVerificationEmail(user, verificationToken);

    const accessToken = createAccessToken(user.id);
    const refreshToken = createRefreshToken(user.id);

    sendRefreshToken(res, refreshToken);

    res.status(201).json({
      status: "success",
      message: "Account created! Please check your email to verify your account.",
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    // Check if email is verified
    if (!user.isVerified) {
      // Optional: Resend verification email if needed
      res.status(403).json({ 
        message: "Account not verified. Check your email for verification link." 
      });
      return;
    }

    // Generate tokens
    const accessToken = createAccessToken(user.id);
    const refreshToken = createRefreshToken(user.id);

    // Set refresh token in cookie
    sendRefreshToken(res, refreshToken);

    // Return response
    res.status(200).json({
      status: "success",
      message: "Login successful",
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        role: user.role,
      }
    });

  } catch (err) {
    next(err);
  }
};

export const resendVerificationEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.userId; // From JWT middleware

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (user.isVerified) {
      res.status(400).json({ message: "Account already verified" });
      return;
    }

    // Delete old tokens and generate a new one
    await Token.deleteMany({ userId: user._id, type: "verify" });
    const verificationToken = await generateRandomToken();
    await Token.create({
      token: verificationToken,
      userId: user._id,
      type: "verify",
      expiresAt: new Date(Date.now() + 3600000), // 1 hour
    });

    // Send email to user.email (not req.body.email)
    await sendVerificationEmail(user, verificationToken);

    res.status(200).json({
      status: "success",
      message: "Verification email resent. Please check your inbox.",
    });
  } catch (err) {
    next(err);
  }
};


export const requestPasswordReset = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "No account with that email exists" });
      return;
    }

    // Delete any existing reset tokens
    await Token.deleteMany({ userId: user._id, type: "reset" });

    // Create reset token
    const resetToken = await generateRandomToken();
    await Token.create({
      token: resetToken,
      userId: user._id,
      type: "reset",
      expiresAt: new Date(Date.now() + 3600000), // 1 hour
    });

    await sendPasswordResetEmail(user, resetToken);

    res.status(200).json({
      status: "success",
      message: "Password reset link sent to your email",
    });
  } catch (err) {
    next(err);
  }
};

export const updatePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.userId; // From access token middleware

    const user = await User.findById(userId).select('+password');
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      res.status(401).json({ message: "Current password is incorrect" });
      return;
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Delete all refresh tokens (optional security measure)
    await Token.deleteMany({ userId: user._id, type: "refresh" });

    res.status(200).json({
      status: "success",
      message: "Password updated successfully",
    });
  } catch (err) {
    next(err);
  }
};