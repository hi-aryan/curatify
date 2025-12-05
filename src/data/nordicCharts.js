/*
    Nordic Charts Data Module
    
    Parses CSV data from regional weekly charts.
    Data is bundled with the app - no API calls required.
*/

import seCsv from "./regional-se-weekly-2025-11-27.csv?raw";
import noCsv from "./regional-no-weekly-2025-11-27.csv?raw";
import fiCsv from "./regional-fi-weekly-2025-11-27.csv?raw";
import dkCsv from "./regional-dk-weekly-2025-11-27.csv?raw";

// Parse CSV into structured data
function parseCSV(csv) {
  const lines = csv.trim().split("\n");
  const headers = lines[0].split(",");

  return lines.slice(1).map((line) => {
    const values = [];
    let current = "";
    let inQuotes = false;

    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        values.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    values.push(current.trim());

    const obj = {};
    headers.forEach((header, i) => {
      obj[header.trim()] = values[i] || "";
    });
    return obj;
  });
}

// Transform raw CSV row to track object
function transformTrack(row, countryCode) {
  return {
    id: `${countryCode}-${row.rank}`,
    rank: parseInt(row.rank, 10),
    trackName: row.track_name,
    artistName: row.artist_names,
    uri: row.uri,
    streams: row.streams,
  };
}

// Parse and organize tracks by country
const tracksByCountry = {
  SE: parseCSV(seCsv)
    .slice(0, 50)
    .map((row) => transformTrack(row, "SE")),
  NO: parseCSV(noCsv)
    .slice(0, 50)
    .map((row) => transformTrack(row, "NO")),
  FI: parseCSV(fiCsv)
    .slice(0, 50)
    .map((row) => transformTrack(row, "FI")),
  DK: parseCSV(dkCsv)
    .slice(0, 50)
    .map((row) => transformTrack(row, "DK")),
};

/*
    Get tracks for a specific country
    @param {string} countryCode - SE, NO, FI, or DK
    @returns {Array} Array of track objects (top 50)
*/
export function getCountryTracks(countryCode) {
  return tracksByCountry[countryCode] || [];
}

/*
    Get all available country codes
    @returns {Array} Array of country code strings
*/
export function getAvailableCountries() {
  return Object.keys(tracksByCountry);
}

// Country display names
export const COUNTRY_NAMES = {
  SE: "Sweden",
  NO: "Norway",
  FI: "Finland",
  DK: "Denmark",
};
