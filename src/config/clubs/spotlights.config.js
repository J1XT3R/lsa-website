/**
 * Club spotlights for the homepage.
 * Rotates weekly: spotlights[weekIndex % spotlights.length].
 * Club names must match the Name field from your clubs data (e.g. Google Sheet).
 */

export const clubSpotlights = [
  { clubName: "CardinalBotics", blurb: "Building robots and futures." },
  { clubName: "Mock Trial", blurb: "Learn the law. Find your voice." },
  { clubName: "Forensic Society", blurb: "Speech & Debate since 1892." },
  { clubName: "Shield and Scroll", blurb: "Honor and service at Lowell." },
  // Add more; order determines weekly rotation.
];

export default clubSpotlights;
