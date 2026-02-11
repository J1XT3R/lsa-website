import PropTypes from "prop-types";
import electionsConfig from "../config/elections.config.js";

/** Map sheet column names (any casing/spacing) to camelCase keys the component uses */
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

export default function Elections({
  electionData,
  electionsEnabled = true,
  electionsConfig: config = electionsConfig,
}) {
  const state = config?.state ?? "result";
  const rawElections = electionData || [];
  const ElectionResults = rawElections.map(normalizeElectionRow).filter((r) => r.board);

  // Elections feature is turned off site-wide
  if (!electionsEnabled) {
    return (
      <section className="election-section election-state-off">
        <div className="election-outer-container">
          <div className="election-inner-container election-message-box">
            <h2>No elections at this time</h2>
            <p>{config?.notHappeningMessage ?? "Elections are not currently happening. Check back later for updates."}</p>
          </div>
        </div>
      </section>
    );
  }

  // State: contesting — show contenders only
  if (state === "contesting") {
    const contenders = config?.contenders ?? [];
    return (
      <section className="election-section">
        <div className="election-state-header">
          <h1>{config?.contestingTitle ?? "Meet the candidates"}</h1>
          <p>{config?.contestingSubtitle ?? "Voting will open soon. Get to know the contenders."}</p>
        </div>
        {contenders.length === 0 ? (
          <div className="election-outer-container">
            <div className="election-inner-container election-message-box">
              <p>Candidate information will be posted here once available.</p>
            </div>
          </div>
        ) : (
          contenders.map((group, index) => (
            <div key={index} className="election-outer-container">
              <div
                className="election-inner-container election-contenders"
                style={{
                  borderLeft: `6px solid ${group.color}`,
                  padding: "1rem",
                  marginBottom: "1rem",
                  backgroundColor: "#fff",
                }}
              >
                <h3 style={{ color: group.color, marginBottom: "0.75rem" }}>{group.board}</h3>
                {group.roles?.map((r, i) => (
                  <div key={i} className="contender-role">
                    <span className="bold">{r.role}:</span>{" "}
                    {Array.isArray(r.candidates) ? r.candidates.join(", ") : r.candidates}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </section>
    );
  }

  // State: polling — vote now message + optional results preview
  if (state === "polling") {
    return (
      <section className="election-section">
        <div className="election-state-header">
          <h1>{config?.pollingTitle ?? "Elections — vote now"}</h1>
          <p>{config?.pollingSubtitle ?? "Polls are open. Cast your vote below."}</p>
        </div>
        <div className="election-outer-container">
          <div className="election-inner-container election-message-box">
            <p>Voting is open. After polls close, official results will be posted on this page.</p>
            {ElectionResults.length > 0 && (
              <p className="election-results-preview-note">Results will appear here once tabulated.</p>
            )}
          </div>
        </div>
      </section>
    );
  }

  // State: result — show full results (default)
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
    <section className="election-section">
      {displayResults.map((element, index) => {
        const {
          board,
          color,
          president,
          vicePresident,
          secretary,
          treasurer,
          publicRelations,
          historian,
          clubCoordinator,
          danceCoordinator,
          communityLiaison,
        } = element;

        return (
          <div key={index} className="election-outer-container">
            <div
              className="election-inner-container"
              style={{
                borderLeft: `6px solid ${color}`,
                padding: "1rem",
                marginBottom: "1rem",
                backgroundColor: "#fff",
              }}
            >
              <h3 style={{ color, marginBottom: "0.5rem" }}>{board}</h3>
              <p><span className="bold">President:</span> {president}</p>
              <p><span className="bold">Vice President:</span> {vicePresident}</p>
              <p><span className="bold">Secretary:</span> {secretary}</p>
              <p><span className="bold">Treasurer:</span> {treasurer}</p>
              <p><span className="bold">Public Relations:</span> {publicRelations}</p>
              {historian && <p><span className="bold">Historian:</span> {historian}</p>}
              {clubCoordinator && <p><span className="bold">Club Coordinator:</span> {clubCoordinator}</p>}
              {danceCoordinator && <p><span className="bold">Dance Coordinator:</span> {danceCoordinator}</p>}
              {communityLiaison && <p><span className="bold">Community Liaison:</span> {communityLiaison}</p>}
            </div>
          </div>
        );
      })}
    </section>
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
