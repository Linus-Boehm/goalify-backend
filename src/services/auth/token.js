import jwt from 'jsonwebtoken';
import * as config from '../../config'

export function signToken(tokenData, expiresIn) {
  jwt.sign({
    id: tokenData._id,
    email: tokenData.email,
    organization_id: tokenData.organization_id,
    role: tokenData.role
  }, config.JwtSecret, {
    expiresIn: expiresIn || 86400 // 24 hours
  });
}
