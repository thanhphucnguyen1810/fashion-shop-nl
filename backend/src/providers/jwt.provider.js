
import JWT from 'jsonwebtoken'

/**
 * userInfo: thông tin đính kèm
 * secretSinature: chữ ký tự bí mật
 * tokenLife: thời gian sống
 */
const generateToken = (userInfo, secretSinature, tokenLife) => {
  try {
    return JWT.sign(userInfo, secretSinature, { algorithm: 'HS256', expiresIn: tokenLife })
  } catch (error) { throw new Error(error) }
}

const verifyToken = async (token, secretSinature) => {
  try {
    return JWT.verify(token, secretSinature)
  } catch (error) { throw new Error(error) }
}

export const JwtProvider = {
  generateToken,
  verifyToken
}

