/**
 * Team Routes
 * Handles team formation and management
 */

const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const { authenticate } = require('../middleware/auth');

/**
 * @route   POST /api/teams
 * @desc    Create a new team
 * @access  Private
 */
router.post('/', authenticate, teamController.createTeam);

/**
 * @route   GET /api/teams/my-teams
 * @desc    Get current user's teams
 * @access  Private
 */
router.get('/my-teams', authenticate, teamController.getMyTeams);

/**
 * @route   GET /api/teams/my-invites
 * @desc    Get teams that have invited current user
 * @access  Private
 */
router.get('/my-invites', authenticate, teamController.getMyInvites);

/**
 * @route   GET /api/teams/event/:eventId
 * @desc    Get all teams for an event
 * @access  Private
 */
router.get('/event/:eventId', authenticate, teamController.getTeamsByEvent);

/**
 * @route   GET /api/teams/:id
 * @desc    Get team by ID
 * @access  Private
 */
router.get('/:id', authenticate, teamController.getTeamById);

/**
 * @route   POST /api/teams/:id/invite
 * @desc    Invite a user to join the team
 * @access  Private (Team leader only)
 */
router.post('/:id/invite', authenticate, teamController.inviteToTeam);

/**
 * @route   POST /api/teams/:id/join
 * @desc    Join a team (accept invitation)
 * @access  Private
 */
router.post('/:id/join', authenticate, teamController.joinTeam);

/**
 * @route   POST /api/teams/:id/leave
 * @desc    Leave a team
 * @access  Private
 */
router.post('/:id/leave', authenticate, teamController.leaveTeam);

/**
 * @route   POST /api/teams/:id/decline
 * @desc    Decline an invitation
 * @access  Private
 */
router.post('/:id/decline', authenticate, teamController.declineInvite);

/**
 * @route   DELETE /api/teams/:id
 * @desc    Delete a team
 * @access  Private (Team leader only)
 */
router.delete('/:id', authenticate, teamController.deleteTeam);

module.exports = router;
