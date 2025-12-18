/**
 * Prompt template for Gemini API to analyze playlist mood
 */
export const MOODBOARD_PROMPT = `Return ONLY valid JSON. Do not include markdown formatting, explanations, or conversational text.

**Task:** Analyze the mood of the provided songs.

**Input:** A JSON array of songs, each with:
- "index": a numeric ID
- "name": song title
- "artists": string of artist names

**Analysis Categories (Score 0.000 to 1.000):**
- **Happiness:** (0.000 = Depressing, 1.000 = Joyful)
- **Sadness:** (0.000 = Not sad, 1.000 = Devastating)
- **Energy:** (0.000 = Acoustic/Sleepy, 1.000 = Intense)
- **Aura:** (0.000 = Weak, 1.000 = High confidence/vibe)

**CRITICAL Rules:**
1. You MUST use exactly 3 decimal places for scores (e.g., 0.857).
2. You MUST analyze EVERY song in the list.
3. Use the provided "index" for each song in your output.

**Output JSON format:**
{
  "analysis": [
    {
      "index": 0,
      "scores": {
        "happiness": 0.857,
        "sadness": 0.123,
        "energy": 0.741,
        "aura": 0.654
      }
    }
  ]
}

**Songs to analyze:**
`;

