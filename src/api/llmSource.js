import { LLM_API_URL, LLM_API_KEY } from "../apiConfig.js";

/*
    LLM API source file (Gemini)
    Contains functions that make fetch calls to LLM API
    
    Used for:
    - Analyzing chart data across countries
    - Generating song recommendations
    - Creating personality insights
*/

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
    let jsonText = responseText.trim()
        .replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/\s*```$/g, '');
    
    const firstBrace = jsonText.indexOf('{');
    const lastBrace = jsonText.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
        jsonText = jsonText.substring(firstBrace, lastBrace + 1);
    }
    
    jsonText = jsonText.replace(/,(\s*[}\]])/g, '$1');
    
    try {
        return JSON.parse(jsonText);
    } catch (error) {
        console.error('Failed to parse Gemini JSON. Raw response:', responseText.substring(0, 500));
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
export function callGeminiAPI(prompt, useGoogleSearch = false) {
  if (!LLM_API_KEY) {
    return Promise.reject(
      new Error(
        "API key is missing. Please set NEXT_PUBLIC_LLM_API_KEY in your .env file"
      )
    );
  }

  if (!LLM_API_URL) {
    return Promise.reject(
      new Error(
        "API URL is missing. Please set NEXT_PUBLIC_LLM_API_URL in your .env file"
      )
    );
  }

  const url = `${LLM_API_URL}?key=${LLM_API_KEY}`;

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ],
  };

  // Enable Google Search grounding for real-time web information
  if (useGoogleSearch) {
    requestBody.tools = [{ googleSearch: {} }];
  }

  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  }).then(async (response) => {
    if (!response.ok) {
      let errorMessage = `LLM API error: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error?.message || errorMessage;
      } catch {
        errorMessage = `${errorMessage} - ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }
    return response.json();
  });
}

// Analyze charts data and return insights
// NOTE: This function is currently unused. If needed, implement using callGeminiAPI or callGeminiJSON
export function analyzeCharts(chartsData) {
  // TODO: Implement actual LLM API call using callGeminiAPI or callGeminiJSON
  throw new Error("analyzeCharts is not implemented. Use callGeminiAPI or callGeminiJSON instead.");
}
