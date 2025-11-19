// frontend/lib/auth.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const COOKIE_NAME = process.env.COOKIE_NAME || "scholarship_session";

/**
 * Hash a plain password using bcrypt.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Compare a plain password with hashed password.
 */
export async function comparePassword(
  plain: string,
  hashed: string
): Promise<boolean> {
  return bcrypt.compare(plain, hashed);
}

/**
 * Create a JWT token containing user id and reg_no.
 */
export function createToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" }); // token valid for 7 days
}

/**
 * Verify the JWT token.
 */
export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

/**
 * Create an HTTP-only cookie with the JWT token.
 */
export function createSessionCookie(token: string) {
  return serialize(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: "strict",
  });
}

/**
 * Clear the session cookie (logout).
 */
export function clearSessionCookie() {
  return serialize(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
    sameSite: "strict",
  });
}
