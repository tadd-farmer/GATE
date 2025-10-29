// Serverless function for Vercel
const Anthropic = require('@anthropic-ai/sdk');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { career } = req.body;
    
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });
    
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
    
    res.json({ content: message.content[0].text });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to generate content' });
  }
};