/**
 * User Controller
 * Handles user profile operations and teammate search
 */

const User = require('../models/User');

/**
 * Get current user's profile
 * GET /api/users/me
 */
const getMyProfile = async (req, res, next) => {
  try {
    // req.user is set by authenticate middleware
    res.json({
      user: req.user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update current user's profile
 * PUT /api/users/me
 */
const updateMyProfile = async (req, res, next) => {
  try {
    const { name, course, branch, year, skills, achievements, phone } = req.body;

    // Find and update user
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        error: {
          code: 404,
          message: 'User not found'
        }
      });
    }

    // Update fields if provided
    if (name) user.name = name;
    if (course !== undefined) user.course = course;
    if (branch !== undefined) user.branch = branch;
    if (year !== undefined) user.year = year;
  if (skills !== undefined) user.skills = skills;
    if (achievements !== undefined) user.achievements = achievements;
  if (phone !== undefined) user.phone = phone;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: user.toJSON()
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all students with optional skill filtering
 * GET /api/users/all?skills=react,python&limit=50
 */
const getAllStudents = async (req, res, next) => {
  try {
    const { skills, limit = 50 } = req.query;

    // Base query - get all students except current user
    let query = {
      role: 'student',
      _id: { $ne: req.user._id }
    };

    // If skills provided, add skill filter
    if (skills && skills.trim()) {
      const skillArray = skills.split(',').map(s => s.trim().toLowerCase());
      query.skills = {
        $in: skillArray.map(skill => new RegExp(skill, 'i'))
      };
    }

    // Find users
    const users = await User.find(query)
      .select('-passwordHash -refreshToken')
      .limit(parseInt(limit))
      .sort({ 'stats.eventsParticipated': -1 }); // Sort by experience

    // Calculate match score if skills provided
    let rankedUsers = users.map(user => {
      let matchScore = 0;
      
      if (skills && skills.trim()) {
        const skillArray = skills.split(',').map(s => s.trim().toLowerCase());
        matchScore = user.skills.filter(userSkill =>
          skillArray.some(searchSkill =>
            userSkill.toLowerCase().includes(searchSkill)
          )
        ).length;
      }

      return {
        ...user.toJSON(),
        matchScore
      };
    });

    // Sort by match score if filtering by skills
    if (skills && skills.trim()) {
      rankedUsers.sort((a, b) => {
        if (b.matchScore !== a.matchScore) {
          return b.matchScore - a.matchScore;
        }
        return b.stats.eventsParticipated - a.stats.eventsParticipated;
      });
    }

    res.json({
      users: rankedUsers,
      total: rankedUsers.length
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Search for users by skills (kept for backward compatibility)
 * GET /api/users/search?skills=react,python&limit=20
 */
const searchUsers = async (req, res, next) => {
  try {
    const { skills, limit = 20 } = req.query;

    if (!skills) {
      return res.status(400).json({
        error: {
          code: 400,
          message: 'Skills parameter is required'
        }
      });
    }

    // Convert comma-separated skills to array
    const skillArray = skills.split(',').map(s => s.trim().toLowerCase());

    // Find users with matching skills
    // We use case-insensitive regex matching
    const users = await User.find({
      role: 'student', // Only search students
      skills: {
        $in: skillArray.map(skill => new RegExp(skill, 'i'))
      },
      _id: { $ne: req.user._id } // Exclude current user
    })
    .select('-passwordHash -refreshToken')
    .limit(parseInt(limit));

    // Calculate match score for each user
    const rankedUsers = users.map(user => {
      // Count how many skills match
      const matchCount = user.skills.filter(userSkill =>
        skillArray.some(searchSkill =>
          userSkill.toLowerCase().includes(searchSkill)
        )
      ).length;

      return {
        ...user.toJSON(),
        matchScore: matchCount
      };
    });

    // Sort by match score (descending), then by events participated (descending)
    rankedUsers.sort((a, b) => {
      if (b.matchScore !== a.matchScore) {
        return b.matchScore - a.matchScore;
      }
      return b.stats.eventsParticipated - a.stats.eventsParticipated;
    });

    res.json({
      users: rankedUsers,
      total: rankedUsers.length
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user by ID
 * GET /api/users/:id
 */
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-passwordHash -refreshToken');

    if (!user) {
      return res.status(404).json({
        error: {
          code: 404,
          message: 'User not found'
        }
      });
    }

    res.json({
      user: user.toJSON()
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
  searchUsers,
  getAllStudents,
  getUserById
};
