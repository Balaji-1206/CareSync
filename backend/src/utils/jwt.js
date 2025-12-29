const jwt = require('jsonwebtoken');

/**
 * Generate JWT token
 * @param {string} userId - User ID
 * @returns {string} JWT token
 */
exports.generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @returns {object|null} Decoded token or null if invalid
 */
exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

/**
 * Generate random token for email verification or password reset
 * @returns {string} Random token
 */
exports.generateRandomToken = () => {
  return require('crypto').randomBytes(32).toString('hex');
};
