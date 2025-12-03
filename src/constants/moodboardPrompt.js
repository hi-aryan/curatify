/**
 * Prompt template for Gemini API to analyze playlist mood
 */
export const MOODBOARD_PROMPT = `Return ONLY valid JSON. Do not include markdown formatting (like \`\`\`json), explanations, or conversational text. Do not add any text before or after the JSON object. Start your response with { and end with }.

**Role:** You are a musicologist and data processing engine.

**Input Data:** I will provide a JSON object representing a Spotify Playlist.

**Task:**
1. Parse the \`tracks.items\` array from the provided JSON. Each item has a \`track\` object with:
   - \`track.name\` - the song title
   - \`track.artists\` - array of artist objects, each with \`name\` property
2. For every single track, analyze the song title and artist. Based on your knowledge of the song's audio features and lyrics, assign a float score from 0.000 to 1.000 for the following four categories:
   - **Happiness:** (0.000 = Depressing, 1.000 = Ecstatic/Joyful)
   - **Sadness:** (0.000 = Not sad, 1.000 = Devastating/Melancholic)
   - **Energy:** (0.000 = Acoustic/Sleepy, 1.000 = High tempo/Intense)
   - **Aura:** (0.000 = Weak presence, 1.000 = High confidence/Swagger/"Main Character Energy" or atmospheric vibe)

   **CRITICAL:** You MUST use precise decimal values with EXACTLY 3 decimal places. DO NOT round to whole numbers or 2 decimal places. Examples of CORRECT values: 0.857, 0.723, 0.641, 0.934, 0.567. Examples of INCORRECT values: 0.86, 0.72, 0.64, 0.9, 0.8, 1.0.

3. Calculate the **Average Score** for each category (Sum of all scores in category / Total number of tracks). Preserve all 3 decimal places in calculations.

4. Identify the **Top 3 Songs** for each category based on the highest scores. Include the exact score with 3 decimal places.

**Constraints:**
- You must analyze EVERY song in the list.
- **MANDATORY:** All scores must have exactly 3 decimal places (e.g., 0.857, 0.723, 0.641, NOT 0.86, 0.72, 0.64).

**Output JSON Structure:**
{
  "playlist_analysis": [
    {
      "track_name": "String",
      "artist_name": "String",
      "scores": {
        "happiness": Float,
        "sadness": Float,
        "energy": Float,
        "aura": Float
      }
    }
  ],
  "averages": {
    "happiness": Float,
    "sadness": Float,
    "energy": Float,
    "aura": Float
  },
  "top_three": {
    "happiness": [
      { "track_name": "String", "artist_name": "String", "score": Float },
      { "track_name": "String", "artist_name": "String", "score": Float },
      { "track_name": "String", "artist_name": "String", "score": Float }
    ],
    "sadness": [ ... ],
    "energy": [ ... ],
    "aura": [ ... ]
  }
}

**Note:** All numeric values in the example above show the required format: exactly 3 decimal places. Follow this format exactly.

**Playlist Data:**
`;

