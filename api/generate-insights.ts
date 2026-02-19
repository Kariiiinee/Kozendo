import { ScanData } from '../src/services/aiService';
import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { body, heart, environment, reflection, vibe, language } = req.body as ScanData;
  const targetLanguage = language === 'fr' ? 'French' : 'English';

  const prompt = `You are a kind and pragmatic coach specialized in following a personal tool called "Wellness scan" (Body, Heart, Environment).
Your role is to analyze the daily entries from User Data I give you and produce a structured, encouraging, non-judgmental feedback with a realistic and motivating tone.

IMPORTANT: You must respond ENTIRELY in ${targetLanguage}. All relevant fields in the JSON response (mainInsight, text, instruction, upliftingQuote) must be translated into ${targetLanguage}.
Response format:
Strengths: 2 to 4 concrete and positive points (start with "Well done!" or "Clear strengths")
What's a bit stuck (and quick ideas): Current observation, Likely hypothesis, and 1 micro-adjustment for the next few days
Maximum 2 to 4 lines, very pragmatic
Small challenge adapted for 24-48h (optional but fun): 1 or 2 very concrete, realistic missions, tailored to the context (weather, energy, location, current project)
Format: Mission xx h: description + why it can help
Throughout, Your tone must remain:
- encouraging without being overly “forced positive coaching”
- realistic and factual
- kind but direct
- focused on observation rather than judgment
- light humor or lightness when appropriate
Do not add general life advice, stay focused on the Radar 3C and on what the person has written.'

User Data:
- Physical: ${body}
- Emotional: ${heart}
- Environment: ${environment}
- Breathing: ${req.body.breathAction || 'not specified'}
- Reflection: ${reflection}
- Vibe: ${vibe}

Return ONLY a JSON object (no markdown):
{
  "mainInsight": "Deep analysis blending psychology with optimism.",
  "microActions": [
    { 
      "id": 1, 
      "text": "Action name", 
      "instruction": "Brief how-to", 
      "icon": "Exactly one of: walk, stretch, water, breath, sun, music, pen, list, eye, clock, moon" 
    }
  ],
  "upliftingQuote": "A relevant uplifting quote."
}
IMPORTANT: The "icon" field is a programmatic key and must NOT be translated. It must contain only one of the lowercase words listed above.`

  const API_KEY = process.env.GOOGLE_API_KEY || '';

  if (!API_KEY) {
    return res.status(500).json({
      error: 'AI Service configuration missing',
      details: 'GOOGLE_API_KEY not set in Vercel Environment Variables.'
    });
  }

  let lastError: any = null;
  const maxRetries = 2;
  const modelsToTry = ['gemini-3-flash-preview', 'gemini-3-flash'];

  for (const modelId of modelsToTry) {
    let retryCount = 0;
    while (retryCount <= maxRetries) {
      try {
        console.log(`Kozenari AI: Attempting with model ${modelId} (Attempt ${retryCount + 1})...`);
        const ai = new GoogleGenAI({ apiKey: API_KEY });
        const response = await ai.models.generateContent({
          model: modelId,
          contents: prompt,
          config: {
            temperature: 0.7,
          },
        });

        const rawText = response.text || '';
        if (!rawText) {
          throw new Error('Empty response from AI Service');
        }

        // Robust JSON Extraction: Clean any markdown code block wrappers
        let cleanText = rawText.trim();
        if (cleanText.startsWith('```json')) {
          cleanText = cleanText.replace(/^```json/, '').replace(/```$/, '').trim();
        } else if (cleanText.startsWith('```')) {
          cleanText = cleanText.replace(/^```/, '').replace(/```$/, '').trim();
        }

        const insights = JSON.parse(cleanText);
        return res.status(200).json(insights);

      } catch (error: any) {
        lastError = error;
        const errorMessage = error?.message || String(error);
        console.error(`Kozenari AI Error (${modelId}, Attempt ${retryCount + 1}):`, errorMessage);

        // Detailed error for 503 or 429
        const isTransient = errorMessage.includes('503') ||
          errorMessage.includes('429') ||
          errorMessage.includes('fetch failed') ||
          errorMessage.includes('model is currently experiencing high demand') ||
          errorMessage.includes('UNAVAILABLE');

        if (isTransient && retryCount < maxRetries) {
          retryCount++;
          const delay = Math.pow(2, retryCount) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // If it's a 404 (Model Not Found) or 400 (Invalid argument/model), try the next model
        if (errorMessage.includes('404') || errorMessage.includes('NOT_FOUND') || errorMessage.includes('400')) {
          break; // Exit while loop to try next modelId
        }

        // For other non-transient errors, stop and report
        break;
      }
    }
  }

  // If we reach here, all models/retries failed
  const finalErrorMessage = lastError?.message || String(lastError);
  const statusCode = finalErrorMessage.includes('401') ? 401 :
    finalErrorMessage.includes('403') ? 403 :
      finalErrorMessage.includes('429') ? 429 :
        finalErrorMessage.includes('503') ? 503 : 500;

  return res.status(statusCode).json({
    error: 'Failed to generate insights',
    code: statusCode,
    details: finalErrorMessage,
    modelAttempted: modelsToTry.join(', ')
  });
}
