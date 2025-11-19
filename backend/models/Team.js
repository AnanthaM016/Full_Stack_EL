/**
 * Team Model
 * Represents teams formed for specific events
 */

const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  // Reference to the event this team is for
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'Event ID is required']
  },
  
  // Team name
  name: {
    type: String,
    required: [true, 'Team name is required'],
    trim: true,
    minlength: [2, 'Team name must be at least 2 characters'],
    maxlength: [100, 'Team name cannot exceed 100 characters']
  },
  
  // Team leader (creator of the team)
  leaderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Team leader is required']
  },
  
  // Current team members (includes the leader)
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Pending invitations (users who have been invited but not yet accepted)
  invites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Compound index: Each user can only be in one team per event
teamSchema.index({ eventId: 1, leaderId: 1 });

// Index for looking up teams by event
teamSchema.index({ eventId: 1 });

// Virtual property to get total team size
teamSchema.virtual('currentSize').get(function() {
  return this.members.length;
});

// Ensure leader is included in members array
teamSchema.pre('save', function(next) {
  // Add leader to members if not already there
  if (!this.members.includes(this.leaderId)) {
    this.members.push(this.leaderId);
  }
  next();
});

// Method to check if team is full
teamSchema.methods.isFull = async function() {
  const Event = mongoose.model('Event');
  const event = await Event.findById(this.eventId);
  
  if (!event) {
    throw new Error('Event not found');
  }
  
  return this.members.length >= event.teamSize.max;
};

// Method to check if a user is already in the team
teamSchema.methods.hasMember = function(userId) {
  return this.members.some(memberId => memberId.toString() === userId.toString());
};

// Method to check if a user has a pending invite
teamSchema.methods.hasInvite = function(userId) {
  return this.invites.some(inviteId => inviteId.toString() === userId.toString());
};

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
