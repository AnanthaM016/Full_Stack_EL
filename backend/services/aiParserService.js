/**
 * AI Parser Service (Stub)
 * Mock service for parsing event brochures
 * In production, this would integrate with Gemini or OpenAI API
 */

/**
 * Parse event brochure and extract structured data
 * This is a STUB that returns mock data
 * 
 * @param {Object} file - Uploaded file object from multer
 * @returns {Promise<Object>} Parsed event data
 */
const parseEventBrochure = async (file) => {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Return mock parsed data
  // In production, you would:
  // 1. Read the file content
  // 2. Send it to Gemini/OpenAI API
  // 3. Use prompt engineering to extract structured data
  // 4. Return the parsed results

  const mockData = {
    title: "Smart India Hackathon 2024",
    description: "A nationwide initiative to provide students with a platform to solve pressing problems we face in our daily lives, and thus inculcate a culture of product innovation and problem-solving.",
    categories: ["Hackathon", "Innovation", "Technology"],
    rules: [
      "Teams must consist of 6 members",
      "All team members must be currently enrolled students",
      "Original ideas only - plagiarism will lead to disqualification",
      "Code must be submitted via GitHub",
      "Final presentation in 10 minutes"
    ],
    deadlines: {
      registrationOpen: new Date(),
      registrationClose: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      eventStart: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days
      eventEnd: new Date(Date.now() + 47 * 24 * 60 * 60 * 1000) // 47 days
    },
    teamSize: {
      min: 4,
      max: 6
    },
    eligibility: [
      "Must be a college student",
      "Age between 18-25",
      "Valid student ID required"
    ]
  };

  console.log('📄 Mock AI Parser: Parsed brochure:', file.originalname);

  return {
    success: true,
    message: 'This is mock data. Integrate with Gemini/OpenAI API for real parsing.',
    parsedData: mockData,
    sourceFile: file.originalname,
    fileSize: file.size,
    mimeType: file.mimetype
  };
};

/**
 * TODO: Real implementation would look like this:
 * 
 * const { GoogleGenerativeAI } = require('@google/generative-ai');
 * const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
 * 
 * const parseEventBrochureReal = async (file) => {
 *   const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
 *   
 *   const prompt = `
 *     Extract the following information from this event brochure:
 *     - Event title
 *     - Description
 *     - Categories/Tags
 *     - Rules
 *     - Important dates (registration, event start/end)
 *     - Team size requirements
 *     - Eligibility criteria
 *     
 *     Return as JSON format.
 *   `;
 *   
 *   const result = await model.generateContent([prompt, file]);
 *   return JSON.parse(result.response.text());
 * };
 */

module.exports = {
  parseEventBrochure
};
