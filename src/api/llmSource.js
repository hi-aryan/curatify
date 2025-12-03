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
 * Call Gemini API with a prompt
 * @param {string} prompt - The prompt to send
 * @returns {Promise<Object>} - Raw Gemini API response
 */
export function callGeminiAPI(prompt) {
  if (!LLM_API_KEY) {
    return Promise.reject(
      new Error(
        "API key is missing. Please set VITE_LLM_API_KEY in your .env file"
      )
    );
  }

  if (!LLM_API_URL) {
    return Promise.reject(
      new Error(
        "API URL is missing. Please set VITE_LLM_API_URL in your .env file"
      )
    );
  }

  const url = `${LLM_API_URL}?key=${LLM_API_KEY}`;

  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    }),
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
export function analyzeCharts(chartsData) {
  // TODO: Implement actual LLM API call
  return fetch(LLM_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${LLM_API_KEY}`,
    },
    body: JSON.stringify({
      prompt: `Analyze these charts: ${JSON.stringify(chartsData)}`,
    }),
  }).then(gotResponseACB);
}
