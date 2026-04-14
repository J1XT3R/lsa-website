import { useParams, Link, Navigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import electionsConfig from "../../config/elections.config.js";
import LoadingTruck from "../../components/LoadingTruck";
import SafeImage from "../../components/SafeImage";
import { areElectionBoardsPublic } from "../../utils/electionAccess.js";
import "./ElectionBoard.scss";

const MEDIA_GLOW_CACHE_KEY = "lsa_election_media_glow_v2";
let mediaGlowCacheMem = null;

function readMediaGlowCache() {
  if (mediaGlowCacheMem) return mediaGlowCacheMem;
  try {
    const raw = localStorage.getItem(MEDIA_GLOW_CACHE_KEY);
    mediaGlowCacheMem = raw ? JSON.parse(raw) : {};
  } catch {
    mediaGlowCacheMem = {};
  }
  return mediaGlowCacheMem;
}

function writeMediaGlowCache(cache) {
  mediaGlowCacheMem = cache;
  try {
    localStorage.setItem(MEDIA_GLOW_CACHE_KEY, JSON.stringify(cache));
  } catch {
    // ignore storage quota/private mode errors
  }
}

function rgbToCss(r, g, b) {
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

function isGoogleDriveUrl(urlRaw) {
  const url = String(urlRaw ?? "").trim();
  return /(^https?:\/\/)?(drive|docs)\.google\.com\//i.test(url);
}

function getAverageColorFromImageUrl(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const sampleW = 48;
        const sampleH = 48;
        const canvas = document.createElement("canvas");
        canvas.width = sampleW;
        canvas.height = sampleH;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) {
          reject(new Error("No canvas context"));
          return;
        }
        ctx.drawImage(img, 0, 0, sampleW, sampleH);
        const { data } = ctx.getImageData(0, 0, sampleW, sampleH);
        let r = 0;
        let g = 0;
        let b = 0;
        let count = 0;
        for (let i = 0; i < data.length; i += 4) {
          const alpha = data[i + 3];
          if (alpha < 16) continue;
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count++;
        }
        if (count === 0) {
          reject(new Error("No opaque pixels"));
          return;
        }
        resolve(rgbToCss(r / count, g / count, b / count));
      } catch (e) {
        reject(e);
      }
    };
    img.onerror = () => reject(new Error("Image load failed"));
    img.src = url;
  });
}

// I HATE GOOGLE DRIVE SO FRIGGIN MUCH THIS ENTIRE FILE TOOK FOREVER TO PROGRAM ALOT OF SWEAT TEARS AND HAIR LOSS CAME FROM GOOGLE DRIVE BEING A PAIN - Gavin Z.
async function getAverageColorWithFallback(url) {
  if (isGoogleDriveUrl(url)) {
    // Drive image endpoints usually block CORS for canvas reads.
    // Skip sampling to avoid noisy console CORS errors.
    throw new Error("Drive URL color sampling skipped");
  }
  try {
    return await getAverageColorFromImageUrl(url);
  } catch {
    // Some hosts (esp. Drive links) block canvas sampling by CORS.
    // In that case we skip glow color instead of spamming failed proxy requests.
    throw new Error("Image color sampling unavailable");
  }
}

// one candidate: photo (hover = video), name, bio, vote button
function ElectionCandidateCard({ candidate, accentColor, onOpenMedia }) {
  const { name, description, pfp, video } = candidate;
  const isDriveVideo = typeof video === "string" && video.includes("drive.google.com");
  const flyerSources = useMemo(() => imageSourceCandidates(pfp), [pfp]);
  const playableVideoSources = useMemo(() => videoSourceCandidates(video), [video]);
  const hasVideo = Boolean(video);
  const [isHoverPreviewVisible, setIsHoverPreviewVisible] = useState(false);
  const [cardGlowColor, setCardGlowColor] = useState("transparent");
  const [videoSourceIndex, setVideoSourceIndex] = useState(0);

  useEffect(() => {
    setVideoSourceIndex(0);
  }, [video]);

  useEffect(() => {
    let cancelled = false;
    if (!pfp) {
      setCardGlowColor("transparent");
      return;
    }
    const cache = readMediaGlowCache();
    if (cache[pfp]) {
      setCardGlowColor(cache[pfp]);
      return;
    }
    getAverageColorWithFallback(pfp)
      .then((avg) => {
        if (cancelled) return;
        setCardGlowColor(avg);
        const next = { ...readMediaGlowCache(), [pfp]: avg };
        writeMediaGlowCache(next);
      })
      .catch(() => {
        if (cancelled) return;
        setCardGlowColor("transparent");
      });
    return () => {
      cancelled = true;
    };
  }, [pfp]);

  function setVideoVisible(container, visible) {
    const videoEl = container?.querySelector(".election-candidate-card-video-preview");
    if (!videoEl) return;
    videoEl.classList.toggle("election-candidate-card-video--visible", visible);
    if (typeof videoEl.play === "function") {
      if (visible) videoEl.play().catch(() => {});
      else {
        videoEl.pause();
        videoEl.currentTime = 0;
      }
    }
  }

  const handleMouseEnter = (e) => {
    if (!hasVideo) return;
    const videoEl = e.currentTarget.querySelector(".election-candidate-card-video-preview");
    const src = videoEl?.getAttribute("data-video-src");
    if (src && videoEl && videoEl.src !== src) videoEl.src = src;
    setIsHoverPreviewVisible(true);
    setVideoVisible(e.currentTarget, true);
  };

  const handleMouseLeave = (e) => {
    if (!hasVideo) return;
    setIsHoverPreviewVisible(false);
    setVideoVisible(e.currentTarget, false);
  };

  const handleMediaClick = () => {
    onOpenMedia(candidate);
  };

  return (
    <article
      className="election-candidate-card"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ "--card-glow-color": cardGlowColor }}
    >
      <div
        className="election-candidate-card-media"
        onClick={handleMediaClick}
        style={{ "--card-accent": accentColor || "var(--title-color)" }}
      >
        {hasVideo && (
          <span className="election-candidate-card-video-tag" aria-label="Has campaign video">
            VIDEO
          </span>
        )}
        <SafeImage
          src={flyerSources}
          alt={name}
          className="election-candidate-card-pfp"
          loading="lazy"
          variant="club"
        />
        {video && !isDriveVideo && (
          <video
            className="election-candidate-card-video election-candidate-card-video-preview"
            data-video-src={playableVideoSources[videoSourceIndex] || video}
            muted
            loop
            playsInline
            preload="none"
            onError={() => {
              setVideoSourceIndex((i) => (i < playableVideoSources.length - 1 ? i + 1 : i));
            }}
          />
        )}
        {isDriveVideo && (
          <video
            className="election-candidate-card-video election-candidate-card-video-preview"
            data-video-src={playableVideoSources[videoSourceIndex] || video}
            muted
            loop
            playsInline
            preload="none"
            onError={() => {
              setVideoSourceIndex((i) => (i < playableVideoSources.length - 1 ? i + 1 : i));
            }}
          />
        )}
        <div className="election-candidate-card-media-bar" aria-hidden>
          {video && (
            <span className="election-candidate-card-media-bar-text">
              {isHoverPreviewVisible ? "PLAYING PREVIEW" : "HOVER TO PLAY VIDEO"}
            </span>
          )}
          {!video && (
            <span className="election-candidate-card-media-bar-text">CLICK TO OPEN FLYER</span>
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
  onOpenMedia: PropTypes.func.isRequired,
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

function extractDriveId(urlRaw) {
  const url = String(urlRaw ?? "").trim();
  if (!url) return "";
  const isDriveUrl = /(^https?:\/\/)?(drive|docs)\.google\.com\//i.test(url);
  if (!isDriveUrl) return "";
  const fromPath = url.match(/\/file\/(?:u\/\d+\/)?d\/([a-zA-Z0-9_-]+)/);
  const fromQuery = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  return fromPath?.[1] || fromQuery?.[1] || "";
}

// Dont even ask how the f**K this code works, I have no idea. - Gavin Z.
function imageSourceCandidates(srcRaw) {
  const src = String(srcRaw ?? "").trim();
  if (!src) return [];
  const id = extractDriveId(src);
  if (!id) return [src];
  const proxy = (u) =>
    `https://images.weserv.nl/?url=${encodeURIComponent(u.replace(/^https?:\/\//i, ""))}&w=1400&h=1400&fit=inside`;
  const u1 = `https://drive.google.com/uc?export=view&id=${id}`;
  const u2 = `https://drive.usercontent.google.com/uc?id=${id}&export=view`;
  const u3 = `https://lh3.googleusercontent.com/d/${id}=s1600`;
  const u4 = `https://drive.google.com/thumbnail?id=${id}&sz=w1600`;
  return [
    u1,
    proxy(u1),
    u2,
    proxy(u2),
    u3,
    proxy(u3),
    u4,
    proxy(u4),
    src,
  ];
}

function videoSourceCandidates(srcRaw) {
  const src = String(srcRaw ?? "").trim();
  if (!src) return [];
  const id = extractDriveId(src);
  if (!id) return [src];
  return [
    `https://drive.google.com/uc?export=view&id=${id}`,
    `https://drive.usercontent.google.com/uc?id=${id}&export=view`,
    `https://drive.google.com/uc?export=download&id=${id}`,
    `https://docs.google.com/uc?export=view&id=${id}`,
    src,
  ];
}

function ElectionMediaModal({ media, onClose }) {
  const hasVideo = Boolean(media?.video);
  const isDriveVideo = typeof media?.video === "string" && media.video.includes("drive.google.com");
  const flyerSources = useMemo(() => imageSourceCandidates(media?.pfp), [media?.pfp]);
  const playableVideoSources = useMemo(() => videoSourceCandidates(media?.video), [media?.video]);
  const [modalVideoIndex, setModalVideoIndex] = useState(0);
  const [modalVideoFailed, setModalVideoFailed] = useState(false);
  useEffect(() => {
    setModalVideoIndex(0);
    setModalVideoFailed(false);
  }, [media?.video, media?.name]);
  if (!media) return null;

  return (
    <div className="election-media-modal-backdrop" role="dialog" aria-modal="true" onClick={onClose}>
      <div
        className={`election-media-modal ${
          hasVideo ? "election-media-modal--video" : "election-media-modal--image"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="election-media-modal-close" onClick={onClose} aria-label="Close media">
          x
        </button>
        <h3 className="election-media-modal-title">{media.name}</h3>
        <div className="election-media-modal-content">
          {hasVideo ? (
            <>
              <video
                className="election-media-modal-video"
                src={playableVideoSources[modalVideoIndex] || media.video}
                controls
                autoPlay
                playsInline
                onError={() => {
                  if (modalVideoIndex < playableVideoSources.length - 1) {
                    setModalVideoIndex((i) => i + 1);
                    return;
                  }
                  setModalVideoFailed(true);
                }}
              />
              {modalVideoFailed && (
                <p style={{ marginTop: "0.75rem", color: "#ddd" }}>
                  {isDriveVideo ? "Drive blocked embedded playback for this file. " : "Could not embed this video here. "}
                  <a href={media.video} target="_blank" rel="noreferrer">
                    Open video in Google Drive
                  </a>
                  .
                </p>
              )}
            </>
          ) : (
            <SafeImage
              src={flyerSources}
              alt={`${media.name} flyer`}
              className="election-media-modal-image"
              variant="club"
            />
          )}
        </div>
      </div>
    </div>
  );
}

ElectionMediaModal.propTypes = {
  media: PropTypes.shape({
    name: PropTypes.string,
    pfp: PropTypes.string,
    video: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
};

export default function ElectionBoard({ electionsConfig: config = electionsConfig }) {
  const { boardSlug } = useParams();
  const [activeMedia, setActiveMedia] = useState(null);

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
                  <ElectionCandidateCard
                    key={i}
                    candidate={c}
                    accentColor={accentColor}
                    onOpenMedia={(candidate) => setActiveMedia(candidate)}
                  />
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
      <ElectionMediaModal media={activeMedia} onClose={() => setActiveMedia(null)} />
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
