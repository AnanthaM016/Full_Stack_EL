/**
 * Chatbot Service (Stub)
 * Mock service for answering event-related questions
 * In production, this would integrate with Gemini or OpenAI API
 */

/**
 * Answer questions about an event using rule-based logic
 * This is a STUB that uses keyword matching
 * 
 * @param {string} question - User's question
 * @param {Object} event - Event object from database
 * @returns {string} Answer to the question
 */
const answerEventQuestion = (question, event) => {
  const lowerQuestion = question.toLowerCase();

  // Keyword-based question answering
  // In production, you would use AI to understand context and intent

  // Questions about deadlines
  if (lowerQuestion.includes('deadline') || lowerQuestion.includes('last date') || lowerQuestion.includes('register')) {
    if (event.deadlines.registrationClose) {
      const date = new Date(event.deadlines.registrationClose).toLocaleDateString();
      return `The registration deadline for ${event.title} is ${date}. Make sure to register before this date!`;
    }
    return `Registration deadline information is not available for this event yet. Please check back later.`;
  }

  // Questions about team size
  if (lowerQuestion.includes('team') && (lowerQuestion.includes('size') || lowerQuestion.includes('member') || lowerQuestion.includes('people'))) {
    return `For ${event.title}, teams should have minimum ${event.teamSize.min} and maximum ${event.teamSize.max} members.`;
  }

  // Questions about event dates
  if (lowerQuestion.includes('when') || lowerQuestion.includes('date') || lowerQuestion.includes('start')) {
    if (event.deadlines.eventStart) {
      const startDate = new Date(event.deadlines.eventStart).toLocaleDateString();
      const endDate = event.deadlines.eventEnd 
        ? new Date(event.deadlines.eventEnd).toLocaleDateString() 
        : 'TBD';
      return `${event.title} starts on ${startDate} and ends on ${endDate}.`;
    }
    return `Event dates will be announced soon. Stay tuned!`;
  }

  // Questions about rules
  if (lowerQuestion.includes('rule') || lowerQuestion.includes('regulation') || lowerQuestion.includes('requirement')) {
    if (event.rules && event.rules.length > 0) {
      const rulesList = event.rules.slice(0, 5).join('\n• ');
      return `Here are the main rules for ${event.title}:\n• ${rulesList}\n\nFor complete details, please check the event description.`;
    }
    return `Detailed rules will be shared soon. Please check the event description for updates.`;
  }

  // Questions about eligibility
  if (lowerQuestion.includes('eligib') || lowerQuestion.includes('can i') || lowerQuestion.includes('allowed')) {
    return `Generally, all college students can participate in ${event.title}. Please check the event description for specific eligibility criteria.`;
  }

  // Questions about prizes
  if (lowerQuestion.includes('prize') || lowerQuestion.includes('reward') || lowerQuestion.includes('win')) {
    return `Prize information for ${event.title} will be announced soon. Keep an eye on the event updates!`;
  }

  // Questions about categories
  if (lowerQuestion.includes('category') || lowerQuestion.includes('type') || lowerQuestion.includes('theme')) {
    if (event.categories && event.categories.length > 0) {
      return `${event.title} falls under these categories: ${event.categories.join(', ')}.`;
    }
    return `Category information is not available yet.`;
  }

  // Default response for unmatched questions
  return `I'm not sure about that specific detail for ${event.title}. Please refer to the event description or contact the organizers for more information. You can also try asking about: deadlines, team size, event dates, rules, or eligibility.`;
};

/**
 * TODO: Real implementation would look like this:
 * 
 * const { GoogleGenerativeAI } = require('@google/generative-ai');
 * const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
 * 
 * const answerEventQuestionReal = async (question, event) => {
 *   const model = genAI.getGenerativeModel({ model: "gemini-pro" });
 *   
 *   const prompt = `
 *     You are a helpful chatbot for college events.
 *     
 *     Event Details:
 *     Title: ${event.title}
 *     Description: ${event.description}
 *     Rules: ${event.rules.join(', ')}
 *     Team Size: ${event.teamSize.min}-${event.teamSize.max}
 *     Deadlines: Registration closes on ${event.deadlines.registrationClose}
 *     
 *     User Question: ${question}
 *     
 *     Provide a helpful, concise answer based on the event details above.
 *   `;
 *   
 *   const result = await model.generateContent(prompt);
 *   return result.response.text();
 * };
 */

module.exports = {
  answerEventQuestion
};
