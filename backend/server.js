// GATE Backend Server
// This server protects your API key and talks to Claude

// Load required packages
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk');

// Create the server
const app = express();
const PORT = process.env.PORT || 3000;

// Set up middleware
app.use(cors()); // Allows frontend to talk to this server
app.use(express.json()); // Allows server to read JSON data

// Initialize Claude with your API key from .env file
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// This endpoint receives career requests from your website
app.post('/generate-career', async (req, res) => {
  try {
    const { career } = req.body;
    
    console.log(`Generating content for: ${career}`);
    
    // Call Claude API
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: `You are creating career exploration content for GATE - a microlearning platform that helps people explore careers through hands-on projects.

Generate content for the career: ${career}

Your response must include these sections:

1. CAREER OVERVIEW (100-150 words)
A broad description of what this career involves - the daily work, the environment, and why people choose this field.

2. REQUIRED SKILLS (5-7 bullet points)
Key skills needed for this career. Be specific and practical.

3. SELF-ASSESSMENT QUESTIONS (4-5 questions)
Reflective questions to help someone assess their fit. Examples:
- "Do you enjoy solving complex problems?"
- "Are you energized by working with data?"

4. MICROLEARNING PROJECT
Create a 60-minute hands-on project following this structure:

   a) PROJECT OVERVIEW (50 words)
   Concise scenario establishing: the context, stakeholder, and challenge.
   
   b) TASKS (3-5 action items)
   Clear tasks that require decision-making and professional judgment, not just following steps.
   
   c) RESULTING ARTIFACT
   Specific description of what they'll create. Must be concrete and portfolio-worthy.
   
   d) CAREER CONNECTION (75 words)
   Explain how this project reflects actual work - the skills used, decisions made, and why professionals do this.

QUALITY CHECKLIST - Verify your project meets ALL criteria:
✓ Would a professional recognize this as real work?
✓ Can someone with no experience complete this in 60 minutes?
✓ Does the artifact demonstrate professional thinking/judgment?
✓ Does it surface both skills AND energy/interest alignment?
✓ Is this appropriate for someone without previous experience?
✓ Is this typical work found in the career?

Format your response with clear section headers.`
      }]
    });
    
    // Send Claude's response back to the website
    res.json({ content: message.content[0].text });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to generate content' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});