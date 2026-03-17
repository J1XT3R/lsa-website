// main site config - turn stuff on/off and wire up elections, clubs, etc.
import electionsConfig from "./elections.config.js";
import { clubCategories, clubSpotlights } from "./clubs/index.js";

export const site = {
  // show Elections in nav and let people hit /Elections
  electionsEnabled: true,
  // all the election state and copy lives in elections.config
  elections: electionsConfig,
};

export const clubs = {
  categories: clubCategories,
  spotlights: clubSpotlights,
};

export { default as organizationsConfig } from "./organizations.config.js";
export { default as electionsConfig } from "./elections.config.js";
export { clubCategories, clubSpotlights } from "./clubs/index.js";

export default site;
