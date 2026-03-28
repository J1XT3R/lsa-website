import Counter from "../components/Counter";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesDown, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import News from "./News";
import { clubSpotlights } from "../config/clubs/index.js";
import { site } from "../config/site.config.js";
import ElectionBanner from "../components/ElectionBanner";
import CardinalympicLogo from "../components/CardinalympicLogo";
import PropTypes from "prop-types";
import SafeImage from "../components/SafeImage";
import {
  normalizeApplicationRow,
  isApplicationOpen,
  isLikelyDataRow,
  parseDateAdded,
} from "../utils/applicationsSheet.js";

const YOUTUBE_EMBED_URL = "https://www.youtube.com/embed/5TKdIrdcyJ4";

const CARDINALYMPICS_CLASS_NAMES = ["Freshman", "Sophomore", "Junior", "Senior"];
const CARDINALYMPICS_CLASS_SLUGS = ["freshman", "sophomore", "junior", "senior"];
const CARDINALYMPICS_COUNTER_COLORS = ["#2e7d32", "#6a1b9a", "#1565c0", "#9c1919"];

function getWeekIndex() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  return Math.floor((now - start) / oneWeek);
}

function extractFileId(url) {
  if (!url || typeof url !== "string") return null;
  const match = url.match(/[?&]id=([^&]+)/);
  return match ? match[1] : null;
}

export default function Home({ cardinalympicsData, newsData, clubData = [], applicationsData = [] }) {
  const spotlights = clubSpotlights || [];
  const weekIndex = getWeekIndex();
  const spotlight = spotlights[weekIndex % spotlights.length];
  const spotlightClub = spotlight && clubData.find(
    (c) => c.Name && c.Name.trim().toLowerCase() === spotlight.clubName.trim().toLowerCase()
  );

  const applicationsOpenForNews = (applicationsData || [])
    .map(normalizeApplicationRow)
    .filter((r) => r && isLikelyDataRow(r) && isApplicationOpen(r))
    .sort((a, b) => parseDateAdded(b.dateAdded) - parseDateAdded(a.dateAdded))
    .slice(0, 5);

  const showElectionBanner =
    site.electionsEnabled &&
    site.elections?.banner?.enabled &&
    (site.elections?.state === "contesting" || site.elections?.state === "polling");

  const spotlightDisplayName = spotlightClub
    ? spotlightClub.Name
    : spotlight?.clubName || "";
  const spotlightDisplayBlurb =
    spotlight?.blurb || spotlightClub?.ClubDescription || "";
  const spotlightHref = spotlightClub
    ? `/Clubs/${encodeURIComponent(spotlightClub.Name)}`
    : "/Clubs";
  const spotlightCtaText = spotlightClub ? "Learn more →" : "Browse clubs →";
  const spotlightInitial = spotlightDisplayName.trim()
    ? spotlightDisplayName.trim().charAt(0).toUpperCase()
    : "";

  const cardinalympicsScores = [0, 1, 2, 3].map((i) => {
    const n = Number(cardinalympicsData?.[i]);
    return Number.isFinite(n) ? n : 0;
  });
  const cardinalympicsLeaderIndex =
    cardinalympicsScores.length === 4
      ? cardinalympicsScores.indexOf(Math.max(...cardinalympicsScores))
      : -1;

  return (
    <>
      <div className="hero-video-wrapper">
        <iframe
          src={`${YOUTUBE_EMBED_URL}?autoplay=1&mute=1&loop=1&playlist=5TKdIrdcyJ4&controls=0&showinfo=0&rel=0&disablekb=1&fs=0&playsinline=1`}
          title="LSA Hero"
          className="hero-video"
          allow="accelerometer; autoplay; muted; encrypted-media"
        />
      </div>
      <div className="video-credit">Video by Video Lowell</div>
      <div className="home-hero-card">
        <p className="home-hero-card__eyebrow">Lowell High School</p>
        <h2 className="home-hero-card__title">Lowell Student Association</h2>
        <p className="home-hero-card__lede">
          Student government for every class — leadership, events, and voice for the Lowell community.
        </p>
        <Link to="/LSA" className="home-hero-card__cta">
          About LSA
          <FontAwesomeIcon icon={faArrowRight} className="home-hero-card__cta-icon" aria-hidden />
        </Link>
      </div>
      {showElectionBanner && (
        <ElectionBanner config={site.elections} />
      )}



      {/* Cardinalympics section */}
      <section
        className="home-cardinalympics"
        aria-labelledby="home-cardinalympics-heading"
      >
        <div className="home-cardinalympics__inner">
          <div className="home-cardinalympics__head-wrap">
            <div className="home-cardinalympics__rings-bg" aria-hidden="true">
              <CardinalympicLogo variant="homeBackdrop" />
            </div>
            <div className="home-cardinalympics__head">
              <div className="home-cardinalympics__title-line">
                <h2 id="home-cardinalympics-heading">Cardinalympics</h2>
                <span
                  className="home-cardinalympics__live"
                  role="status"
                  aria-label="Scores from the live scoreboard"
                >
                  <span className="home-cardinalympics__live-dot" aria-hidden="true" />
                  Live
                </span>
              </div>
              <p className="home-cardinalympics__subtitle">
                Spirit Week class totals!!!
              </p>
            </div>
          </div>
          <div className="home-cardinalympics__grid" role="list">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={CARDINALYMPICS_CLASS_SLUGS[i]}
                className={`home-cardinalympics__class home-cardinalympics__class--${CARDINALYMPICS_CLASS_SLUGS[i]}${
                  cardinalympicsLeaderIndex === i ? " home-cardinalympics__class--leader" : ""
                }`}
                role="listitem"
              >
                {cardinalympicsLeaderIndex === i && (
                  <span className="home-cardinalympics__leader-badge">Leading</span>
                )}
                <span className="home-cardinalympics__class-name">
                  {CARDINALYMPICS_CLASS_NAMES[i]}
                </span>
                <div className="home-cardinalympics__points">
                  <Counter
                    start={0}
                    end={cardinalympicsScores[i]}
                    duration={2000}
                    className="home-cardinalympics__counter"
                    color={CARDINALYMPICS_COUNTER_COLORS[i]}
                  />
                  <span className="home-cardinalympics__pts-label">pts</span>
                </div>
              </div>
            ))}
          </div>
          <Link to="/Cardinalympics" className="home-cardinalympics__link">
            Full scoreboard &amp; events →
          </Link>
        </div>
      </section>



      {/* LSA description section */}
      <FontAwesomeIcon icon={faAnglesDown} beatFade className="scroll-icon" />
      <div className="lsa-description center" id="welcome-lsa">
        <h1>Welcome to the Lowell Student Association!</h1>
        <p className="padding-1rem">
          LSA is the umbrella term for Lowell&apos;s student government or all
          the boards, which includes the Student Body Council, and class boards
          representing the Senior, Junior, Sophomore, and Freshmen classes.
        </p>
        <h2 className="center">We connect with</h2>
        <div className="stats" aria-label="We connect with statistics">
          <div className="stat-card center">
            <div className="stat-card__value">
              <Counter
                start={0}
                end={2500}
                duration={2000}
                className="counter"
                color="var(--lowell-red)"
              />
              <span className="stat-card__plus">+</span>
            </div>
            <p className="stat-card__label">Students</p>
          </div>
          <div className="stat-card center">
            <div className="stat-card__value">
              <Counter
                start={0}
                end={150}
                duration={2000}
                className="counter"
                color="var(--lowell-red)"
              />
              <span className="stat-card__plus">+</span>
            </div>
            <p className="stat-card__label">Clubs</p>
          </div>
          <div className="stat-card center">
            <div className="stat-card__value">
              <Counter
                start={0}
                end={9000}
                duration={2000}
                className="counter"
                color="var(--lowell-red)"
              />
              <span className="stat-card__plus">+</span>
            </div>
            <p className="stat-card__label">Alumni</p>
          </div>
        </div>
      </div>
      {spotlight && (
        <div className="club-spotlight-section center">
          <h2>Club spotlight</h2>
          <div className="club-spotlight">
            <div className="club-spotlight__media" aria-hidden="true">
              {spotlightClub?.Picture ? (
                <SafeImage
                  src={`https://drive.google.com/thumbnail?id=${extractFileId(spotlightClub.Picture)}&sz=w300`}
                  alt={spotlightDisplayName}
                  className="club-spotlight__img"
                  variant="club"
                />
              ) : (
                <div className="club-spotlight__placeholder">{spotlightInitial}</div>
              )}
            </div>
            <div className="club-spotlight__content">
              <h3>{spotlightDisplayName}</h3>
              <p>{spotlightDisplayBlurb}</p>
              <Link to={spotlightHref} className="club-spotlight-link">
                {spotlightCtaText}
              </Link>
            </div>
          </div>
        </div>
      )}
      {applicationsOpenForNews.length > 0 && (
        <div className="applications-news-section center">
          <h2>Applications now open</h2>
          <div className="applications-news-container">
            {applicationsOpenForNews.map((item, index) => (
              <div key={index} className="applications-news-item">
                <h3>{item.name}</h3>
                {item.dateAdded && <p className="applications-news-date">Added: {item.dateAdded}</p>}
                {item.notes && <p className="applications-news-content">{item.notes}</p>}
                {item.link && (
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="applications-news-link">
                    Go to application →
                  </a>
                )}
              </div>
            ))}
          </div>
          <p className="center applications-news-view-all">
            <Link to="/ApplicationsOpen" className="applications-news-view-all__button">
              View all applications open
            </Link>
          </p>
        </div>
      )}
      <News newsData={newsData} />
      <div className="life-at-lowell">
        <h2>WATCH: Student Life at Lowell High School</h2>
        <div className="responsive-video-wrapper">
          <iframe
            src={YOUTUBE_EMBED_URL}
            title="Student Life at Lowell High School"
            className="responsive-video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
      <div className="preamble flex-center">
        <p>
          “We, the students of Lowell High School, in order to maintain the
          Lowell community, to acknowledge and foster the diversity of needs,
          views, and rights of students at Lowell to express opinions and
          interests to the community on relevant issues regarding student life,
          to promote the educational welfare, and to enhance all benefits
          offered by the school and the San Francisco Unified School District,
          do hereby establish and ordain this Charter of the Lowell High School
          Student Association.”
        </p>
        <span className="bold">
          PREAMBLE OF THE CHARTER OF THE LOWELL STUDENT ASSOCIATION
        </span>
      </div>
    </>
  );
}

Home.propTypes = {
  cardinalympicsData: PropTypes.arrayOf(PropTypes.number),
  newsData: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
    })
  ),
  clubData: PropTypes.arrayOf(
    PropTypes.shape({
      Name: PropTypes.string,
      Picture: PropTypes.string,
      ClubDescription: PropTypes.string,
    })
  ),
  applicationsData: PropTypes.arrayOf(PropTypes.object),
};
