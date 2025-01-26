// src/lib/auth/jwt.ts
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret';

interface TokenPayload {
 userId: number;
 email: string;
}

export function createToken(payload: TokenPayload): string {
 return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

export function verifyToken(token: string): TokenPayload | null {
 try {
   return jwt.verify(token, JWT_SECRET) as TokenPayload;
 } catch {
   return null;
 }
}