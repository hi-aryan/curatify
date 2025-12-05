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
      "track_name": "Example Song",
      "artist_name": "Example Artist",
      "scores": {
        "happiness": 0.857,
        "sadness": 0.234,
        "energy": 0.723,
        "aura": 0.641
      }
    }
  ],
  "averages": {
    "happiness": 0.723,
    "sadness": 0.456,
    "energy": 0.834,
    "aura": 0.567
  },
  "top_three": {
    "happiness": [
      { "track_name": "Happy Song", "artist_name": "Happy Artist", "score": 0.957 },
      { "track_name": "Joyful Song", "artist_name": "Joyful Artist", "score": 0.934 },
      { "track_name": "Upbeat Song", "artist_name": "Upbeat Artist", "score": 0.912 }
    ],
    "sadness": [
      { "track_name": "Sad Song", "artist_name": "Sad Artist", "score": 0.876 },
      { "track_name": "Melancholic Song", "artist_name": "Melancholic Artist", "score": 0.843 },
      { "track_name": "Emotional Song", "artist_name": "Emotional Artist", "score": 0.821 }
    ],
    "energy": [
      { "track_name": "Energetic Song", "artist_name": "Energetic Artist", "score": 0.945 },
      { "track_name": "Intense Song", "artist_name": "Intense Artist", "score": 0.923 },
      { "track_name": "Powerful Song", "artist_name": "Powerful Artist", "score": 0.901 }
    ],
    "aura": [
      { "track_name": "Confident Song", "artist_name": "Confident Artist", "score": 0.967 },
      { "track_name": "Bold Song", "artist_name": "Bold Artist", "score": 0.945 },
      { "track_name": "Strong Song", "artist_name": "Strong Artist", "score": 0.923 }
    ]
  }
}

**CRITICAL:** Every single numeric value MUST have exactly 3 decimal places. Use values like 0.857, 0.723, 0.641 - NEVER use 0.86, 0.72, 0.64, 0.9, or 1.0. The examples above show the EXACT format required.

**Playlist Data:**
`;

