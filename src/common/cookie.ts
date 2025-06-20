import { Response } from 'express';

export const cookie = (
  res: Response,
  refreshToken: string,
  id: string,
  token: string,
) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari
  });
  return { id, token };
};
