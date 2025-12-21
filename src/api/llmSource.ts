import { LLM_API_URL, LLM_API_KEY } from "../apiConfig";

/*
    LLM API source file (Gemini)
    Contains functions that make fetch calls to LLM API
    
    Used for:
    - Analyzing chart data across countries
    - Generating song recommendations
    - Creating personality insights
*/

interface GeminiPart {
    text: string;
}

interface GeminiContent {
    parts: GeminiPart[];
}

interface GeminiTool {
    googleSearch: Record<string, never>;
}

interface GeminiRequest {
    contents: GeminiContent[];
    tools?: GeminiTool[];
}

function gotResponseACB(response) {
  if (!response.ok) {
    throw new Error("LLM API error: " + response.status);
  }
  return response.json();
}

/**
 * Extract text from Gemini API response format
 * @param {Object} response - Raw Gemini API response
 * @returns {string|null} - Extracted text or null
 */
export function extractGeminiText(response) {
  return response?.candidates?.[0]?.content?.parts?.[0]?.text || null;
}

/**
 * Parse JSON from Gemini API response, handling markdown and extra text
 * @param {string} responseText - Raw text response from Gemini
 * @returns {Object} - Parsed JSON object
 */
export function parseGeminiJSON(responseText) {
  let jsonText = responseText
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/, "")
    .replace(/\s*```$/g, "");

  const firstBrace = jsonText.indexOf("{");
  const lastBrace = jsonText.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    jsonText = jsonText.substring(firstBrace, lastBrace + 1);
  }

  jsonText = jsonText.replace(/,(\s*[}\]])/g, "$1");

  try {
    return JSON.parse(jsonText);
  } catch (error) {
    console.error(
      "Failed to parse Gemini JSON. Raw response:",
      responseText.substring(0, 500)
    );
    throw new Error(`Failed to parse JSON: ${error.message}`);
  }
}

/**
 * Call Gemini API and return parsed JSON
 * Handles the full workflow: call → extract → parse
 * @param {string} prompt - The prompt to send
 * @param {boolean} useGoogleSearch - Whether to enable Google Search grounding
 * @returns {Promise<Object>} - Parsed JSON object from Gemini response
 */
export async function callGeminiJSON(prompt, useGoogleSearch = false) {
  const response = await callGeminiAPI(prompt, useGoogleSearch);
  const text = extractGeminiText(response);
  if (!text) {
    throw new Error("No response from Gemini API");
  }
  return parseGeminiJSON(text);
}

/**
 * Call Gemini API with a prompt
 * @param {string} prompt - The prompt to send
 * @param {boolean} useGoogleSearch - Whether to enable Google Search grounding
 * @returns {Promise<Object>} - Raw Gemini API response
 */
// Helper for delay
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Call Gemini API with a prompt
 * @param {string} prompt - The prompt to send
 * @param {boolean} useGoogleSearch - Whether to enable Google Search grounding
 * @returns {Promise<Object>} - Raw Gemini API response
 */
export async function callGeminiAPI(prompt, useGoogleSearch = false) {
    if (!LLM_API_KEY) {
        throw new Error("API key is missing. Please set NEXT_PUBLIC_LLM_API_KEY in your .env file");
    }

    if (!LLM_API_URL) {
        throw new Error("API URL is missing. Please set NEXT_PUBLIC_LLM_API_URL in your .env file");
    }

    const url = `${LLM_API_URL}?key=${LLM_API_KEY}`;
    
    const requestBody: GeminiRequest = {
        contents: [{ parts: [{ text: prompt }] }],
    };

    if (useGoogleSearch) {
        requestBody.tools = [{ googleSearch: {} }];
    }

    // Retry logic with exponential backoff
    const MAX_RETRIES = 3;
    let attempt = 0;

    while (attempt < MAX_RETRIES) {
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                // If 503 (Overloaded) or 500/502/504 (Server Errors), throw to trigger retry
                if (response.status === 503 || response.status === 429 || (response.status >= 500 && response.status <= 504)) {
                    throw new Error(`Server Busy (${response.status})`);
                }
                
                // Other errors (400, 401, 403) are likely permanent, so parse and throw immediately
                let errorMessage = `LLM API error: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error?.message || errorMessage;
                } catch { /* ignore parse error */ }
                throw new Error(errorMessage);
            }

            return await response.json(); // Success!

        } catch (error) {
            attempt++;
            console.warn(`Gemini API attempt ${attempt} failed: ${error.message}`);
            
            if (attempt >= MAX_RETRIES) {
                throw error; // Give up
            }

            // Exponential backoff: 1s, 2s, 4s
            await delay(1000 * Math.pow(2, attempt - 1));
        }
    }
}

/**
 * Get AI-powered song recommendations based on user's profile
 * @param {Array} topTracks - User's top tracks
 * @param {Array} topArtists - User's top artists
 * @param {string} topGenre - User's top genre
 * @returns {Promise<Object>} - Object containing recommendation list
 */
export async function getAiRecommendations(topTracks, topArtists, topGenre) {
    const tracksText = topTracks?.map(t => `${t.name} by ${t.artists[0].name}`).join(', ');
    const artistsText = topArtists?.map(a => a.name).join(', ');
    
    // We enable Google Search to ensure songs are real
    const useSearch = true; 
    
    const prompt = `
        You are an expert music curator. 
        User Profile:
        - Top Tracks: ${tracksText}
        - Top Artists: ${artistsText}
        - Favorite Genre: ${topGenre}

        Task: Recommend 3 songs using Google Search to verify they exist.
    
        IMPORTANT RESPONSE RULES:
        1. Output ONLY a valid JSON object. 
        2. Do NOT use Markdown code blocks (no \`\`\`json).
        3. Do NOT write any introduction, explanation, or conclusion.
        4. Start the response immediately with "{".
    
        Required Songs:
        1. "Safe Bet": Matches their taste perfectly.
        2. "Wild Card": A creative, unexpected choice that still fits their vibe (think adjancent genres or deep cuts). Verify this song exists.
        3. "Discovery": A highly-rated, less-known gem.

        Output JSON format:
        {
            "recommendations": [
                {
                    "title": "Exact Song Title",
                    "artist": "Exact Artist Name",
                    "type": "Safe Bet", 
                    "reason": "Convincing reason why they will like it."
                }
            ]
        }
    `;

    return callGeminiJSON(prompt, useSearch);
}

/**
 * Get a deep, personalized music analysis based on quiz answers and listening data
 * @param {Array} topTracks - User's top tracks
 * @param {Array} topArtists - User's top artists
 * @param {Array} quizAnswers - User's answers from the landing page quiz
 * @returns {Promise<Object>} - Object containing deep metrics and a persona-based description
 */
export async function getDeepAnalysis(topTracks, topArtists, quizAnswers) {
    const tracksText = topTracks?.map(t => `${t.name} by ${t.artists[0].name}`).join(', ');
    const artistsText = topArtists?.map(a => a.name).join(', ');
    const quizText = quizAnswers?.map(q => `Q: ${q.question} A: ${q.answer}`).join('\n');
    
    const prompt = `
        You are a Deep Music Psychologist. 
        Your goal is to reveal something fundamental about the user by blending their explicit self-reflection (Quiz) with their actual subconscious behavior (Listening Data).
        
        User Reflection (Quiz):
        ${quizText}

        Listening Behavior:
        - Top Tracks: ${tracksText}
        - Top Artists: ${artistsText}

        Task: 
        1. Create a "Music Archetype" (a unique title).
        2. Provide 3 "Hidden Metrics" (e.g., "Rhythm Seeker", "Melodic Empath", "Vibe Architect") with a % value and a 1-sentence explanation.
        3. Write a 2-sentence "Deep Profile" that explains the core truth of their taste.

        IMPORTANT RESPONSE RULES:
        1. Output ONLY a valid JSON object. 
        2. Do NOT use Markdown code blocks.
        3. BE EXTREMELY CONCISE. Use brief, punchy language.
        4. No fluff. No introductions. 
        5. The "Deep Profile" MUST be exactly 2 sentences.

        Output JSON format:
        {
            "archetype": "The Ethereal Voyager",
            "metrics": [
                { "label": "Sonic Curiosity", "value": 85, "description": "You crave textures that defy standard genres." },
                { "label": "Emotional Resonance", "value": 92, "description": "Your tracks are mirrors of complex internal landscapes." },
                { "label": "Pattern Disruption", "value": 64, "description": "You enjoy when rhythms challenge your expectations." }
            ],
            "profile": "Your deep profile description here..."
        }
    `;

    return callGeminiJSON(prompt, false);
}
