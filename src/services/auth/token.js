import jwt from 'jsonwebtoken';
import * as config from '../../config'
import bcrypt from "bcryptjs";

export function signToken(tokenData, expiresIn) {
  return jwt.sign({
    sub: "auth",
    id: tokenData._id,
    email: tokenData.email,
    organization_id: tokenData.organization_id,
    role: tokenData.role
  }, config.JwtSecret, {
    expiresIn: expiresIn || 86400 // 24 hours
  });
}
export function createVerfiyToken(id) {
  return jwt.sign({
    sub: "verfiy",
    id: id,
  }, config.JwtSecret, {
    expiresIn: 86400 // 24 hours
  });
}

export function createResetToken(id, password) {
  const hash = bcrypt.hashSync(password.substring(0,8), 10);
  return jwt.sign({
    sub: "reset",
    hash,
    id: id,
  }, config.JwtSecret, {
    expiresIn: 86400 // 24 hours
  });
}
