import { ScanData } from '../src/services/aiService';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { body, heart, environment, reflection, vibe } = req.body as ScanData;

  const prompt = `
    You are the Kozendo Wellness AI, acting as both a professional wellness coach and a highly trained psychologist. 
    Your goal is to provide a detailed, deep analysis of the user's emotional and physical state based on their check-in data, then conclude with a powerful, optimistic, and positive message.
    
    User Data:
    - Physical State: ${body}
    - Emotional State: ${heart}
    - Environment: ${environment}
    - Breathing Reflection: ${req.body.breathAction}
    - Daily Reflection: ${reflection}
    - Overall Vibe: ${vibe}

    TASK:
    1. Analyze the user's feelings, emotions, and general state with the depth of a psychologist.
    2. Synthesize these insights into a "mainInsight" that is both analytical and deeply optimistic.
    3. Select 2-3 highly relevant micro-actions from the list below.
    4. Provide an uplifting quote that resonates with your analysis.

    AVAILABLE MICRO-ACTIONS (Choose 2-3 most relevant):
    - Extended Exhale Breathing (1–2 min): Inhale 4 · Exhale 6–8
    - Unclench Check (30 sec): Relax jaw, shoulders, hands, belly
    - Orient to Safety (1 min): Name 3 neutral/pleasant things nearby
    - Gentle Neck Roll (1 min): Slow, pain-free circles
    - Warm Sensation (2 min): Hold a warm mug/hands on chest
    - Label the Feeling (30 sec): "Right now, I feel ___, and I’m okay."
    - Lower the Pace (1 min): Intentionally slow next movement
    - Light Exposure Reset (2 min): Step outside or near a window
    - Power Stretch (1 min): Reach up, open chest
    - Cold Water Splash (30 sec): Face or wrists with cool water
    - Name One Intention (30 sec): "What matters most right now?"
    - Move One Joint (1 min): Rotate ankles, wrists, shoulders
    - Hydration Pause (1 min): Drink water slowly
    - Music Micro-Boost (2 min): Play one uplifting song
    - Define Tiny Step (30 sec): Make it almost too easy
    - 2-Minute Rule: Start for just two minutes
    - Visual Finish (1 min): Picture the task done
    - Change Location (1 min): Stand up, shift rooms
    - Speak It Aloud (30 sec): "I’m starting now."
    - Remove One Obstacle (1 min): Close one tab, clear one item
    - Celebrate Starting (10 sec): Acknowledge effort
    - Physiological Sigh (1 min): Two short inhales, long exhale
    - Dim Environment (2 min): Lower lights
    - Body Scan Lite (2 min): Relax forehead to legs
    - Write One Thought (1 min): "Tomorrow, I’ll handle this."
    - Slow Counting Breaths (2 min): Count exhales 10 to 1
    - Gentle Self-Touch (1 min): Hand on chest or belly

    Return EXACTLY a JSON object without any markdown formatting wrappers:
    {
      "mainInsight": "A detailed analysis (3-4 sentences) of the user's state, blending psychological depth with a professional wellness perspective, always ending on an optimistic, life-affirming note.",
      "microActions": [
        { "id": 1, "text": "Action label", "instruction": "Brief how-to instruction from the list above", "icon": "accessibility_new | water_drop | air" }
      ],
      "upliftingQuote": "A highly relevant quote from the official 365 library."
    }
  `;

  const API_KEY = process.env.GOOGLE_API_KEY || '';

  if (!API_KEY) {
    console.error('Kozendo API Error: GOOGLE_API_KEY is not defined in process.env');
    return res.status(500).json({
      error: 'AI Service configuration missing',
      details: 'The GOOGLE_API_KEY environment variable is not detected by the serverless function. Please ensure you have added it in Vercel -> Settings -> Environment Variables and triggered a RE-DEPLOY.'
    });
  }

  // Using gemini-3-flash: the 2026 stable standard for high-speed analysis
  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-3-flash:generateContent`;

  try {
    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': API_KEY // Use both query param and header for maximum compatibility
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.7
        }
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Gemini API Error Response:', data);
      return res.status(response.status).json({
        error: 'Gemini API returned an error',
        details: data.error?.message || 'Unknown error'
      });
    }

    // Extract the text content from Gemini's response
    const candidate = data.candidates?.[0];
    const rawText = candidate?.content?.parts?.[0]?.text;

    if (!rawText) {
      console.error('Unexpected Gemini Response Structure:', data);
      return res.status(500).json({ error: 'Invalid response from AI Service' });
    }

    // Robust JSON Extraction: Clean any markdown code block wrappers
    let cleanText = rawText.trim();
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/^```/, '').replace(/```$/, '').trim();
    }

    // Parse the generated text into the structured JSON for the frontend
    const insights = JSON.parse(cleanText);

    return res.status(200).json(insights);
  } catch (error: any) {
    console.error('Kozendo AI Handler Error:', error);
    return res.status(500).json({
      error: 'Failed to generate insights',
      message: error instanceof Error ? error.message : 'Unknown server error'
    });
  }
}
