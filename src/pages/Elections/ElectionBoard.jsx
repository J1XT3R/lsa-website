import { useParams, Link, Navigate } from "react-router-dom";
import { useMemo } from "react";
import PropTypes from "prop-types";
import electionsConfig from "../../config/elections.config.js";
import LoadingTruck from "../../components/LoadingTruck";
import SafeImage from "../../components/SafeImage";
import { areElectionBoardsPublic } from "../../utils/electionAccess.js";
import "./ElectionBoard.scss";

// one candidate: photo (hover = video), name, bio, vote button
function ElectionCandidateCard({ candidate, accentColor }) {
  const { name, description, pfp, video } = candidate;

  const handleMouseEnter = (e) => {
    const videoEl = e.currentTarget.querySelector(".election-candidate-card-video");
    if (videoEl) {
      const src = videoEl.getAttribute("data-video-src");
      if (src && !videoEl.src) videoEl.src = src;
      videoEl.classList.add("election-candidate-card-video--visible");
      videoEl.play().catch(() => {});
    }
  };

  const handleMouseLeave = (e) => {
    const videoEl = e.currentTarget.querySelector(".election-candidate-card-video");
    if (videoEl) {
      videoEl.classList.remove("election-candidate-card-video--visible");
      videoEl.pause();
      videoEl.currentTime = 0;
    }
  };

  return (
    <article className="election-candidate-card">
      <div
        className="election-candidate-card-media"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ "--card-accent": accentColor || "var(--title-color)" }}
      >
        <SafeImage
          src={pfp}
          alt={name}
          className="election-candidate-card-pfp"
          loading="lazy"
          variant="club"
        />
        {video && (
          <video
            className="election-candidate-card-video"
            data-video-src={video}
            muted
            loop
            playsInline
            preload="none"
          />
        )}
        <div className="election-candidate-card-media-bar" aria-hidden>
          {video && (
            <span className="election-candidate-card-media-bar-text">HOVER TO VIEW VIDEO</span>
          )}
        </div>
      </div>
      <div className="election-candidate-card-body">
        <div className="election-candidate-card-name-wrap">
          <h3 className="election-candidate-card-name">{name}</h3>
          <span className="election-candidate-card-name-underline" style={{ backgroundColor: accentColor || "var(--title-color)" }} aria-hidden />
        </div>
        {description && (
          <p className="election-candidate-card-description">{description}</p>
        )}
        <button type="button" className="election-candidate-card-vote-btn">
          VOTE NOW
        </button>
      </div>
    </article>
  );
}

ElectionCandidateCard.propTypes = {
  candidate: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    pfp: PropTypes.string,
    video: PropTypes.string,
  }).isRequired,
  accentColor: PropTypes.string,
};

// config sometimes gives us just a name string - turn it into a proper candidate object so we arent cooked
function normalizeCandidate(c) {
  if (typeof c === "string") {
    return { name: c, description: "", pfp: `https://i.pravatar.cc/400?u=${encodeURIComponent(c)}`, video: "" };
  }
  return {
    name: c.name ?? "",
    description: c.description ?? "",
    pfp: c.pfp ?? `https://i.pravatar.cc/400?u=${encodeURIComponent(c.name || "c")}`,
    video: c.video ?? "",
  };
}

export default function ElectionBoard({ electionsConfig: config = electionsConfig }) {
  const { boardSlug } = useParams();

  const { board, prevSlug, nextSlug } = useMemo(() => {
    const contenders = config?.contenders ?? [];
    const list = contenders.filter((b) => b.slug != null);
    const index = list.findIndex((b) => b.slug === boardSlug);
    const boardData = index >= 0 ? list[index] : null;
    return {
      board: boardData,
      prevSlug: index > 0 ? list[index - 1].slug : null,
      nextSlug: index >= 0 && index < list.length - 1 ? list[index + 1].slug : null,
    };
  }, [config, boardSlug]);

  if (!areElectionBoardsPublic(config)) {
    return <Navigate to="/Elections" replace />;
  }

  if (!board) {
    return <LoadingTruck />;
  }

  const accentColor = board.color || "var(--title-color)";

  return (
    <div className="election-board-page" style={{ "--board-accent": accentColor }}>
      <header className="election-board-hero">
        <h1 className="election-board-hero-title">{board.board}</h1>
        <p className="election-board-hero-subtitle">Meet the candidates</p>
      </header>

      <main className="election-board-main">
        {(board.roles ?? []).map((roleGroup, roleIndex) => {
          const candidates = (roleGroup.candidates ?? []).map(normalizeCandidate);
          if (candidates.length === 0) return null;
          return (
            <section key={roleIndex} className="election-board-role-section">
              <h2 className="election-board-role-title" style={{ borderLeftColor: accentColor }}>
                {roleGroup.role}
              </h2>
              <div className="election-board-candidates-grid">
                {candidates.map((c, i) => (
                  <ElectionCandidateCard key={i} candidate={c} accentColor={accentColor} />
                ))}
              </div>
            </section>
          );
        })}
      </main>

      <nav className="election-board-nav">
        {prevSlug ? (
          <Link to={`/Elections/${prevSlug}`} className="election-board-nav-btn election-board-nav-btn--prev">
            ← Last board
          </Link>
        ) : (
          <span className="election-board-nav-btn election-board-nav-btn--disabled">← Last board</span>
        )}
        <Link to="/Elections" className="election-board-nav-btn">
          All boards
        </Link>
        {nextSlug ? (
          <Link to={`/Elections/${nextSlug}`} className="election-board-nav-btn election-board-nav-btn--next">
            Next board →
          </Link>
        ) : (
          <span className="election-board-nav-btn election-board-nav-btn--disabled">Next board →</span>
        )}
      </nav>
    </div>
  );
}

ElectionBoard.propTypes = {
  electionsConfig: PropTypes.shape({
    contenders: PropTypes.arrayOf(
      PropTypes.shape({
        slug: PropTypes.string,
        board: PropTypes.string,
        color: PropTypes.string,
        roles: PropTypes.arrayOf(
          PropTypes.shape({
            role: PropTypes.string,
            candidates: PropTypes.array,
          })
        ),
      })
    ),
  }),
};
