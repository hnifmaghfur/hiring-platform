import { Request } from 'express';

export interface JwtTokenPayload {
  id: string;
  email: string;
  role: number;
  // Add other JWT payload fields if needed
}

declare module 'express' {
  export interface Request {
    token?: JwtTokenPayload;
  }
}
