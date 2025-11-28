import { LLM_API_URL, LLM_API_KEY } from "../apiConfig.js";

/*
    LLM API source file (OpenAI / Gemini)
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

// Analyze charts data and return insights
export function analyzeCharts(chartsData) {
    // TODO: Implement actual LLM API call
    // This is a placeholder structure
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

// Test Gemini API with a simple prompt
export function callGeminiAPI(prompt) {
    if (!LLM_API_KEY) {
        return Promise.reject(new Error("API key is missing. Please set VITE_LLM_API_KEY in your .env file"));
    }
    
    if (!LLM_API_URL) {
        return Promise.reject(new Error("API URL is missing. Please set VITE_LLM_API_URL in your .env file"));
    }
    
    // Gemini API uses API key as query parameter
    const url = `${LLM_API_URL}?key=${LLM_API_KEY}`;
    
    return fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: prompt
                }]
            }]
        }),
    }).then(async (response) => {
        if (!response.ok) {
            // Try to get more error details from the response
            let errorMessage = `LLM API error: ${response.status}`;
            try {
                const errorData = await response.json();
                errorMessage = errorData.error?.message || errorMessage;
            } catch {
                // If response isn't JSON, use status text
                errorMessage = `${errorMessage} - ${response.statusText}`;
            }
            throw new Error(errorMessage);
        }
        return response.json();
    });
}

// TODO: Add more LLM functions as needed
// - getSongRecommendations(userSongs)
// - getPersonalityReview(listeningHistory)

