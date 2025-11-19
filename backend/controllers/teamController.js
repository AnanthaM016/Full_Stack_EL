/**
 * Team Controller
 * Handles team formation, invitations, and joining
 */

const Team = require('../models/Team');
const Event = require('../models/Event');
const User = require('../models/User');

/**
 * Create a new team for an event
 * POST /api/teams
 */
const createTeam = async (req, res, next) => {
  try {
    const { eventId, name } = req.body;

    // Validate required fields
    if (!eventId || !name) {
      return res.status(400).json({
        error: {
          code: 400,
          message: 'Event ID and team name are required'
        }
      });
    }

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ 
        error: {
          code: 404,
          message: 'Event not found'
        }
      });
    }

    // Check if user already has a team for this event
    const existingTeam = await Team.findOne({
      eventId,
      $or: [
        { leaderId: req.user._id },
        { members: req.user._id }
      ]
    });

    if (existingTeam) {
      return res.status(400).json({
        error: {
          code: 400,
          message: 'You are already part of a team for this event'
        }
      });
    }

    // Create new team
    const team = new Team({
      eventId,
      name,
      leaderId: req.user._id,
      members: [req.user._id],
      invites: []
    });

    await team.save();

    // Populate team members and event
    await team.populate('leaderId', 'name email skills');
    await team.populate('members', 'name email skills');
    await team.populate('eventId', 'title teamSize');

    res.status(201).json({
      message: 'Team created successfully',
      team
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get team by ID
 * GET /api/teams/:id
 */
const getTeamById = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('leaderId', 'name email skills stats')
      .populate('members', 'name email skills stats')
      .populate('invites', 'name email skills')
      .populate('eventId', 'title teamSize');

    if (!team) {
      return res.status(404).json({
        error: {
          code: 404,
          message: 'Team not found'
        }
      });
    }

    res.json({
      team
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all teams for an event
 * GET /api/teams/event/:eventId
 */
const getTeamsByEvent = async (req, res, next) => {
  try {
    const teams = await Team.find({ eventId: req.params.eventId })
      .populate('leaderId', 'name email')
      .populate('members', 'name email')
      .populate('eventId', 'title');

    res.json({
      teams,
      total: teams.length
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user's teams
 * GET /api/teams/my-teams
 */
const getMyTeams = async (req, res, next) => {
  try {
    const teams = await Team.find({
      $or: [
        { leaderId: req.user._id },
        { members: req.user._id }
      ]
    })
    .populate('leaderId', 'name email')
    .populate('members', 'name email')
    .populate('eventId', 'title status deadlines');

    res.json({
      teams,
      total: teams.length
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Invite a user to join the team
 * POST /api/teams/:id/invite
 */
const inviteToTeam = async (req, res, next) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        error: {
          code: 400,
          message: 'User ID is required'
        }
      });
    }

    // Find team
    const team = await Team.findById(req.params.id).populate('eventId');

    if (!team) {
      return res.status(404).json({
        error: {
          code: 404,
          message: 'Team not found'
        }
      });
    }

    // Only team leader can invite
    if (team.leaderId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: {
          code: 403,
          message: 'Only team leader can invite members'
        }
      });
    }

    // Check if team is full
    if (await team.isFull()) {
      return res.status(400).json({
        error: {
          code: 400,
          message: 'Team is already full'
        }
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: {
          code: 404,
          message: 'User not found'
        }
      });
    }

    // Check if user is already a member
    if (team.hasMember(userId)) {
      return res.status(400).json({
        error: {
          code: 400,
          message: 'User is already a team member'
        }
      });
    }

    // Check if user already has an invite
    if (team.hasInvite(userId)) {
      return res.status(400).json({
        error: {
          code: 400,
          message: 'User already has a pending invite'
        }
      });
    }

    // Check if user is already in another team for this event
    const existingTeam = await Team.findOne({
      eventId: team.eventId,
      $or: [
        { leaderId: userId },
        { members: userId }
      ]
    });

    if (existingTeam) {
      return res.status(400).json({
        error: {
          code: 400,
          message: 'User is already part of another team for this event'
        }
      });
    }

    // Add invite
    team.invites.push(userId);
    await team.save();

    await team.populate('invites', 'name email skills');

    res.json({
      message: 'Invite sent successfully',
      team
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Join a team (accept invitation)
 * POST /api/teams/:id/join
 */
const joinTeam = async (req, res, next) => {
  try {
    // Find team
    const team = await Team.findById(req.params.id).populate('eventId');

    if (!team) {
      return res.status(404).json({
        error: {
          code: 404,
          message: 'Team not found'
        }
      });
    }

    // Check if user has an invite
    if (!team.hasInvite(req.user._id)) {
      return res.status(400).json({
        error: {
          code: 400,
          message: 'You do not have an invite to this team'
        }
      });
    }

    // Check if team is full
    if (await team.isFull()) {
      return res.status(400).json({
        error: {
          code: 400,
          message: 'Team is already full'
        }
      });
    }

    // Remove from invites and add to members
    team.invites = team.invites.filter(
      id => id.toString() !== req.user._id.toString()
    );
    team.members.push(req.user._id);

    await team.save();

    await team.populate('leaderId', 'name email skills');
    await team.populate('members', 'name email skills');
    await team.populate('invites', 'name email skills');

    res.json({
      message: 'Successfully joined team',
      team
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Leave a team
 * POST /api/teams/:id/leave
 */
const leaveTeam = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        error: {
          code: 404,
          message: 'Team not found'
        }
      });
    }

    // Check if user is a member
    if (!team.hasMember(req.user._id)) {
      return res.status(400).json({
        error: {
          code: 400,
          message: 'You are not a member of this team'
        }
      });
    }

    // Team leader cannot leave (must delete team instead)
    if (team.leaderId.toString() === req.user._id.toString()) {
      return res.status(400).json({
        error: {
          code: 400,
          message: 'Team leader cannot leave. Delete the team instead.'
        }
      });
    }

    // Remove user from members
    team.members = team.members.filter(
      id => id.toString() !== req.user._id.toString()
    );

    await team.save();

    res.json({
      message: 'Successfully left team'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a team (leader only)
 * DELETE /api/teams/:id
 */
const deleteTeam = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        error: {
          code: 404,
          message: 'Team not found'
        }
      });
    }

    // Only team leader can delete
    if (team.leaderId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: {
          code: 403,
          message: 'Only team leader can delete the team'
        }
      });
    }

    await Team.findByIdAndDelete(req.params.id);

    res.json({
      message: 'Team deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get teams that have invited the current user
 * GET /api/teams/my-invites
 */
const getMyInvites = async (req, res, next) => {
  try {
    const teams = await Team.find({
      invites: req.user._id
    })
    .populate('leaderId', 'name email')
    .populate('eventId', 'title status')
    .populate('invites', 'name email');

    res.json({
      invites: teams,
      total: teams.length
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Decline an invitation to a team
 * POST /api/teams/:id/decline
 */
const declineInvite = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        error: { code: 404, message: 'Team not found' }
      });
    }

    // Check user actually has an invite
    if (!team.hasInvite(req.user._id)) {
      return res.status(400).json({
        error: { code: 400, message: 'You do not have an invite to this team' }
      });
    }

    // Remove the invite
    team.invites = team.invites.filter(id => id.toString() !== req.user._id.toString());
    await team.save();

    res.json({
      message: 'Invitation declined'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTeam,
  getTeamById,
  getTeamsByEvent,
  getMyTeams,
  getMyInvites,
  inviteToTeam,
  joinTeam,
  leaveTeam,
  declineInvite,
  deleteTeam
};
