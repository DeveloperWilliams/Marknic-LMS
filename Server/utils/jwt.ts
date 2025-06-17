import jwt from "jsonwebtoken";
import { Response } from "express";

const signToken = (id: string, secret: string, expiresIn: string): string => {
  // @ts-ignore
  return jwt.sign({ id }, secret, { expiresIn });
};

export const createAccessToken = (userId: string): string => {
  return signToken(
    userId,
    process.env.JWT_SECRET!,
    process.env.JWT_EXPIRES_IN!
  );
};

export const createRefreshToken = (userId: string): string => {
  return signToken(
    userId,
    process.env.REFRESH_TOKEN_SECRET!,
    process.env.REFRESH_TOKEN_EXPIRES_IN!
  );
};

export const sendRefreshToken = (res: Response, token: string): void => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: parseInt(process.env.COOKIE_EXPIRES_IN!) * 24 * 60 * 60 * 1000,
  });
};
