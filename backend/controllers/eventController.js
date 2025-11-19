/**
 * Event Controller
 * Handles event CRUD operations, brochure parsing, and chatbot
 */

const Event = require('../models/Event');
const { parseEventBrochure } = require('../services/aiParserService');
const { answerEventQuestion } = require('../services/chatbotService');

/**
 * Create a new event (Admin only)
 * POST /api/events
 */
const createEvent = async (req, res, next) => {
  try {
    const {
      title,
      description,
      categories,
      rules,
      deadlines,
      teamSize,
      brochureUrl
    } = req.body;

    // Validate required fields
    if (!title || !description || !categories || !teamSize) {
      return res.status(400).json({
        error: {
          code: 400,
          message: 'Title, description, categories, and teamSize are required'
        }
      });
    }

    // Create new event
    const event = new Event({
      title,
      description,
      categories,
      rules: rules || [],
      deadlines: deadlines || {},
      teamSize,
      brochureUrl,
      createdBy: req.user._id
    });

    await event.save();

    // Populate creator info
    await event.populate('createdBy', 'name email');

    res.status(201).json({
      message: 'Event created successfully',
      event
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all events with optional filters
 * GET /api/events?status=upcoming&category=hackathon
 */
const getEvents = async (req, res, next) => {
  try {
    const { status, category, limit = 50, page = 1 } = req.query;

    // Build filter object
    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (category) {
      filter.categories = { $in: [new RegExp(category, 'i')] };
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get events
    const events = await Event.find(filter)
      .populate('createdBy', 'name email')
      .sort({ 'deadlines.eventStart': 1 }) // Sort by event start date
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Event.countDocuments(filter);

    res.json({
      events,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single event by ID
 * GET /api/events/:id
 */
const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!event) {
      return res.status(404).json({
        error: {
          code: 404,
          message: 'Event not found'
        }
      });
    }

    // Update status before returning
    event.updateStatus();
    await event.save();

    res.json({
      event
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update event (Admin only)
 * PUT /api/events/:id
 */
const updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        error: {
          code: 404,
          message: 'Event not found'
        }
      });
    }

    // Check if user is the creator or admin
    if (event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: {
          code: 403,
          message: 'Not authorized to update this event'
        }
      });
    }

    // Update fields
    const {
      title,
      description,
      categories,
      rules,
      deadlines,
      teamSize,
      brochureUrl,
      status
    } = req.body;

    if (title) event.title = title;
    if (description) event.description = description;
    if (categories) event.categories = categories;
    if (rules) event.rules = rules;
    if (deadlines) event.deadlines = { ...event.deadlines, ...deadlines };
    if (teamSize) event.teamSize = teamSize;
    if (brochureUrl !== undefined) event.brochureUrl = brochureUrl;
    if (status) event.status = status;

    await event.save();
    await event.populate('createdBy', 'name email');

    res.json({
      message: 'Event updated successfully',
      event
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete event (Admin only)
 * DELETE /api/events/:id
 */
const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        error: {
          code: 404,
          message: 'Event not found'
        }
      });
    }

    // Check if user is the creator
    if (event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: {
          code: 403,
          message: 'Not authorized to delete this event'
        }
      });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.json({
      message: 'Event deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Parse event brochure using AI (Stub)
 * POST /api/events/:id/parse-brochure
 */
const parseBrochure = async (req, res, next) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        error: {
          code: 400,
          message: 'No file uploaded'
        }
      });
    }

    // Use AI parser stub to extract event details
    const parsedData = await parseEventBrochure(req.file);

    res.json({
      message: 'Brochure parsed successfully (stub)',
      data: parsedData
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Ask chatbot about event (Stub)
 * POST /api/events/:id/ask
 */
const askChatbot = async (req, res, next) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        error: {
          code: 400,
          message: 'Question is required'
        }
      });
    }

    // Get event details
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        error: {
          code: 404,
          message: 'Event not found'
        }
      });
    }

    // Use chatbot stub to answer question
    const answer = answerEventQuestion(question, event);

    res.json({
      question,
      answer
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  parseBrochure,
  askChatbot
};
