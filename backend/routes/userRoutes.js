/**
 * User Routes
 * Handles user profile and search operations
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');

/**
 * @route   GET /api/users/me
 * @desc    Get current user's profile
 * @access  Private
 */
router.get('/me', authenticate, userController.getMyProfile);

/**
 * @route   PUT /api/users/me
 * @desc    Update current user's profile
 * @access  Private
 */
router.put('/me', authenticate, userController.updateMyProfile);

/**
 * @route   GET /api/users/all
 * @desc    Get all students with optional skill filtering
 * @access  Private
 */
router.get('/all', authenticate, userController.getAllStudents);

/**
 * @route   GET /api/users/search
 * @desc    Search for users by skills
 * @access  Private
 */
router.get('/search', authenticate, userController.searchUsers);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Private
 */
router.get('/:id', authenticate, userController.getUserById);

module.exports = router;
