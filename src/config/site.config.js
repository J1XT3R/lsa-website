/**
 * Global site configuration.
 * Edit this file to toggle features and set site-wide options.
 */

import electionsConfig from "./elections.config.js";
import { clubCategories, clubSpotlights } from "./clubs/index.js";

export const site = {
  /** Show Elections in nav and allow /Elections route */
  electionsEnabled: true,
  /** Elections sub-config (state, messages, etc.) */
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
