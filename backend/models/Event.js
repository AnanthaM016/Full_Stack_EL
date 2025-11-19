/**
 * Event Model
 * Represents hackathons, ideathons, and other college events
 */

const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  // Basic event information
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  
  description: {
    type: String,
    required: [true, 'Event description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters'],
    maxlength: [5000, 'Description cannot exceed 5000 characters']
  },
  
  // Categories help with filtering (e.g., "Hackathon", "Ideathon", "Research")
  categories: {
    type: [String],
    default: [],
    validate: {
      validator: function(arr) {
        return arr.length > 0 && arr.length <= 10;
      },
      message: 'Event must have at least 1 and at most 10 categories'
    }
  },
  
  // Rules and eligibility criteria
  rules: {
    type: [String],
    default: [],
    validate: {
      validator: function(arr) {
        return arr.length <= 50;
      },
      message: 'Cannot have more than 50 rules'
    }
  },
  
  // Important dates
  deadlines: {
    registrationOpen: {
      type: Date,
      default: Date.now
    },
    registrationClose: {
      type: Date
    },
    eventStart: {
      type: Date
    },
    eventEnd: {
      type: Date
    }
  },
  
  // Team size constraints
  teamSize: {
    min: {
      type: Number,
      required: [true, 'Minimum team size is required'],
      min: [1, 'Minimum team size must be at least 1']
    },
    max: {
      type: Number,
      required: [true, 'Maximum team size is required'],
      min: [1, 'Maximum team size must be at least 1'],
      validate: {
        validator: function(val) {
          return val >= this.teamSize.min;
        },
        message: 'Maximum team size must be greater than or equal to minimum'
      }
    }
  },
  
  // Optional brochure/image URL
  brochureUrl: {
    type: String,
    trim: true
  },
  
  // Event status (automatically computed based on dates)
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'past'],
    default: 'upcoming'
  },
  
  // Reference to the admin who created this event
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Event creator is required']
  }
}, {
  timestamps: true
});

// Indexes for faster queries
eventSchema.index({ status: 1 });
eventSchema.index({ categories: 1 });
eventSchema.index({ 'deadlines.eventStart': 1 });

// Method to update event status based on current date
eventSchema.methods.updateStatus = function() {
  const now = new Date();
  
  if (this.deadlines.eventEnd && now > this.deadlines.eventEnd) {
    this.status = 'past';
  } else if (this.deadlines.eventStart && now >= this.deadlines.eventStart) {
    this.status = 'ongoing';
  } else {
    this.status = 'upcoming';
  }
  
  return this.status;
};

// Pre-save hook to auto-update status
eventSchema.pre('save', function(next) {
  this.updateStatus();
  next();
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
