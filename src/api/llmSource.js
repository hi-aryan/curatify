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

// TODO: Add more LLM functions as needed
// - getSongRecommendations(userSongs)
// - getPersonalityReview(listeningHistory)

