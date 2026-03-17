import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import electionsConfig from "../config/elections.config.js";
import "./Elections.scss";

// sheet columns can be "President" or "president" or whatever - normalize to camelCase so we don't cry
function normalizeElectionRow(row) {
  if (!row || typeof row !== "object") return row;
  const keyMap = {
    board: ["board", "Board"],
    color: ["color", "Color"],
    president: ["president", "President"],
    vicePresident: ["vicePresident", "Vice President", "VicePresident"],
    secretary: ["secretary", "Secretary"],
    treasurer: ["treasurer", "Treasurer"],
    publicRelations: ["publicRelations", "Public Relations", "PublicRelations"],
    historian: ["historian", "Historian"],
    clubCoordinator: ["clubCoordinator", "Club Coordinator", "ClubCoordinator"],
    danceCoordinator: ["danceCoordinator", "Dance Coordinator", "DanceCoordinator"],
    communityLiaison: ["communityLiaison", "Community Liaison", "CommunityLiaison"],
  };
  const out = {};
  for (const [camelKey, possibleHeaders] of Object.entries(keyMap)) {
    for (const h of possibleHeaders) {
      if (row[h] !== undefined && row[h] !== "") {
        out[camelKey] = row[h];
        break;
      }
    }
  }
  return out;
}

// which roles we show and what we call them on the results cards
const RESULT_ROLES = [
  ["president", "President"],
  ["vicePresident", "Vice President"],
  ["secretary", "Secretary"],
  ["treasurer", "Treasurer"],
  ["publicRelations", "Public Relations"],
  ["historian", "Historian"],
  ["clubCoordinator", "Club Coordinator"],
  ["danceCoordinator", "Dance Coordinator"],
  ["communityLiaison", "Community Liaison"],
];

function getResultRows(element) {
  const rows = [];
  for (const [key, label] of RESULT_ROLES) {
    const value = element[key];
    if (value != null && String(value).trim() !== "") rows.push({ role: label, value: String(value).trim() });
  }
  return rows;
}

// one little card per board - title, accent color, list of roles/names
function ElectionBoardCard({ board, color, rows }) {
  const accent = color || "var(--title-color)";

  return (
    <article className="election-board-card" style={{ "--board-accent": accent }}>
      <div className="election-board-card-header">
        <h3 className="election-board-card-title">{board}</h3>
      </div>
      <div className="election-board-card-body">
        {rows.map(({ role, value }, i) => (
          <div key={i} className="election-board-card-row">
            <span className="election-board-card-role">{role}:</span>
            <span className="election-board-card-value">{value}</span>
          </div>
        ))}
      </div>
    </article>
  );
}

ElectionBoardCard.propTypes = {
  board: PropTypes.string.isRequired,
  color: PropTypes.string,
  rows: PropTypes.arrayOf(
    PropTypes.shape({ role: PropTypes.string.isRequired, value: PropTypes.string.isRequired })
  ).isRequired,
};

export default function Elections({
  electionData,
  electionsEnabled = true,
  electionsConfig: config = electionsConfig,
}) {
  const state = config?.state ?? "result";
  const rawElections = electionData || [];
  const ElectionResults = rawElections.map(normalizeElectionRow).filter((r) => r.board);

  // nobody's voting right now - show the "elections are closed" message
  if (!electionsEnabled) {
    return (
      <div className="elections-page">
        <header className="elections-hero">
          <h1 className="elections-hero-title">LSA Board</h1>
          <p className="elections-hero-subtitle">Elections</p>
        </header>
        <section className="election-section election-state-off">
          <div className="elections-message-box">
            <h2>No elections at this time</h2>
            <p>{config?.notHappeningMessage ?? "Elections are not currently happening. Check back later for updates."}</p>
          </div>
        </section>
      </div>
    );
  }

  // campaign season - show the candidates before voting opens
  if (state === "contesting") {
    const contenders = config?.contenders ?? [];
    return (
      <div className="elections-page">
        <header className="elections-hero">
          <h1 className="elections-hero-title">LSA Board</h1>
          <p className="elections-hero-subtitle">Elections</p>
        </header>
        <section className="election-section">
          <div className="elections-state-header">
            <h1>{config?.contestingTitle ?? "Meet the candidates"}</h1>
            <p>{config?.contestingSubtitle ?? "Voting will open soon. Get to know the contenders."}</p>
          </div>
          {contenders.length === 0 ? (
            <div className="elections-message-box">
              <p>Candidate information will be posted here once available.</p>
            </div>
          ) : (
            <div className="elections-board-cards">
              {contenders.map((group, index) => {
                const rows = (group.roles ?? []).map((r) => {
                  const cands = Array.isArray(r.candidates) ? r.candidates : [];
                  const names = cands.map((c) => (typeof c === "string" ? c : c?.name ?? "")).filter(Boolean);
                  return { role: r.role, value: names.join(", ") };
                });
                const slug = group.slug;
                const card = (
                  <ElectionBoardCard
                    key={index}
                    board={group.board}
                    color={group.color}
                    rows={rows}
                  />
                );
                return slug ? (
                  <Link key={index} to={`/Elections/${slug}`} className="elections-board-card-link">
                    {card}
                  </Link>
                ) : (
                  <div key={index}>{card}</div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    );
  }

  // polls are open! tell people to vote (results show after close)
  if (state === "polling") {
    return (
      <div className="elections-page">
        <header className="elections-hero">
          <h1 className="elections-hero-title">LSA Board</h1>
          <p className="elections-hero-subtitle">Elections</p>
        </header>
        <section className="election-section">
          <div className="elections-state-header">
            <h1>{config?.pollingTitle ?? "Elections - vote now"}</h1>
            <p>{config?.pollingSubtitle ?? "Polls are open. Cast your vote below."}</p>
          </div>
          <div className="elections-message-box">
            <p>Voting is open. After polls close, official results will be posted on this page.</p>
            {ElectionResults.length > 0 && (
              <p style={{ marginTop: "0.75rem", fontStyle: "italic", color: "#666" }}>
                Results will appear here once tabulated.
              </p>
            )}
          </div>
        </section>
      </div>
    );
  }

  // the good stuff - final results (or placeholder if sheet is empty)
  const displayResults = ElectionResults.length > 0 ? ElectionResults : [
    {
      board: "LSA 2029 Election Results",
      color: "#9c1919",
      president: "Taran Yang",
      vicePresident: "Preston Wang",
      secretary: "Violette Trinh-Hsu",
      treasurer: "Shirley Guan",
      publicRelations: "Zarina Gorji",
      historian: "Ashley Zhao",
    },
  ];

  return (
    <div className="elections-page">
      <header className="elections-hero">
        <h1 className="elections-hero-title">LSA Board</h1>
        <p className="elections-hero-subtitle">Elections</p>
        <span className="elections-hero-badge">Results</span>
      </header>
      <section className="election-section">
        <div className="elections-board-cards">
          {displayResults.map((element, index) => (
            <ElectionBoardCard
              key={index}
              board={element.board}
              color={element.color}
              rows={getResultRows(element)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

Elections.propTypes = {
  electionData: PropTypes.arrayOf(
    PropTypes.shape({
      board: PropTypes.string,
      color: PropTypes.string,
      president: PropTypes.string,
      vicePresident: PropTypes.string,
      secretary: PropTypes.string,
      treasurer: PropTypes.string,
      publicRelations: PropTypes.string,
      historian: PropTypes.string,
      clubCoordinator: PropTypes.string,
      danceCoordinator: PropTypes.string,
      communityLiaison: PropTypes.string,
    })
  ),
  electionsEnabled: PropTypes.bool,
  electionsConfig: PropTypes.shape({
    state: PropTypes.oneOf(["contesting", "polling", "result"]),
    notHappeningMessage: PropTypes.string,
    contestingTitle: PropTypes.string,
    contestingSubtitle: PropTypes.string,
    pollingTitle: PropTypes.string,
    pollingSubtitle: PropTypes.string,
    contenders: PropTypes.arrayOf(
      PropTypes.shape({
        board: PropTypes.string,
        color: PropTypes.string,
        roles: PropTypes.arrayOf(
          PropTypes.shape({
            role: PropTypes.string,
            candidates: PropTypes.arrayOf(PropTypes.string),
          })
        ),
      })
    ),
  }),
};
