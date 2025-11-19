/**
 * Authentication Middleware
 * Protects routes by verifying JWT tokens
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Verify JWT access token and attach user to request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: {
          code: 401,
          message: 'No token provided'
        }
      });
    }

    // Extract token (remove "Bearer " prefix)
    const token = authHeader.substring(7);

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // Find user by ID from token
    const user = await User.findById(decoded.userId).select('-passwordHash -refreshToken');

    if (!user) {
      return res.status(401).json({
        error: {
          code: 401,
          message: 'User not found'
        }
      });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: {
          code: 401,
          message: 'Token expired'
        }
      });
    }

    return res.status(401).json({
      error: {
        code: 401,
        message: 'Invalid token'
      }
    });
  }
};

/**
 * Verify user has admin role
 * Must be used after authenticate middleware
 */
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      error: {
        code: 403,
        message: 'Admin access required'
      }
    });
  }
  next();
};

/**
 * Verify user has student role
 * Must be used after authenticate middleware
 */
const requireStudent = (req, res, next) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({
      error: {
        code: 403,
        message: 'Student access required'
      }
    });
  }
  next();
};

module.exports = {
  authenticate,
  requireAdmin,
  requireStudent
};
