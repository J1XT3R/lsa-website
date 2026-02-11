/**
 * Elections configuration.
 * Set enabled in site.config.js. Here you control state and copy.
 *
 * State: "off" | "contesting" | "polling" | "result"
 * - off: not used when elections are disabled (site.config)
 * - contesting: only contenders are shown (campaign period)
 * - polling: voting open; show "Vote now" + optional live results bar
 * - result: show final results
 */

export default {
  /** "contesting" | "polling" | "result" (only used when elections are enabled) */
  state: "contesting",

  /** Shown when state is "contesting" or "polling" (election in progress) */
  banner: {
    enabled: true,
    title: "Elections in progress",
    message: "Make your voice heard — vote in LSA elections.",
    ctaText: "Vote now",
    ctaPath: "/Elections",
  },

  /** Shown in Layout when state is "polling" (e.g. "Polling for results") */
  pollingBar: {
    enabled: true,
    message: "Polls are open. Results will be posted after voting ends.",
    resultsLabel: "Results",
    resultsPath: "/Elections",
  },

  /** Shown on Elections page when state is "off" (elections disabled globally) */
  notHappeningMessage: "Elections are not currently happening. Check back later for updates.",

  /** Shown on Elections page when state is "contesting" (before voting) */
  contestingTitle: "Meet the candidates",
  contestingSubtitle: "Voting will open soon. Get to know the contenders.",

  /** Shown when state is "polling" */
  pollingTitle: "Elections — vote now",
  pollingSubtitle: "Polls are open. Cast your vote below.",

  /**
   * Contenders for state "contesting". Shown when no live election data is used.
   * When using sheet data, contenders can come from electionData with type "contenders".
   */
  contenders: [
    {
      board: "LSA 2030 Elections",
      color: "#9c1919",
      roles: [
        { role: "President", candidates: ["Candidate A", "Candidate B"] },
        { role: "Vice President", candidates: ["Candidate C", "Candidate D"] },
        { role: "Secretary", candidates: ["Candidate E"] },
      ],
    },
  ],
};
