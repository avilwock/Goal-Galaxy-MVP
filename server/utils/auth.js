import jwt from 'jsonwebtoken';

export const signToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );
};

export const AuthenticationError = class AuthenticationError extends Error {
  constructor(message = 'Not authenticated') {
    super(message);
    this.name = 'AuthenticationError';
  }
};