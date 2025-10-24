module.exports = {
  secret: process.env.JWT_SECRET,
  refreshSecret: process.env.JWT_REFRESH_SECRET,
  expiresIn: process.env.JWT_EXPIRE || '1h',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',
};
