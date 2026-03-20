import Counter from "../components/Counter";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesDown } from "@fortawesome/free-solid-svg-icons";
import News from "./News";
import { clubSpotlights } from "../config/clubs/index.js";
import { site } from "../config/site.config.js";
import ElectionBanner from "../components/ElectionBanner";
import PropTypes from "prop-types";
import SafeImage from "../components/SafeImage";
import {
  normalizeApplicationRow,
  isApplicationOpen,
  isLikelyDataRow,
  parseDateAdded,
} from "../utils/applicationsSheet.js";

const YOUTUBE_EMBED_URL = "https://www.youtube.com/embed/5TKdIrdcyJ4";

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

// `cardinalympicsData` is currently only used in a commented-out section.
// Keep the prop for future use, but avoid unused var lint noise.
// eslint-disable-next-line no-unused-vars
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
      <div className="intro-container">
        <h2>Lowell Student Association</h2>
        <Link to="LSA">Learn more</Link>
      </div>
      {showElectionBanner && (
        <ElectionBanner config={site.elections} />
      )}

      {/* TODO: Add back in Cardinalympics section on home page when it's back */}
      {/* <div className="intro-container">
                <h2>2025 Cardinalympics!</h2>
                <div className="cardinalympics-scores">
                        <div className="score">
                            <h2>Freshman:&nbsp;</h2> 
                            <Counter start={0} end={cardinalympicsData[0]} duration = {2000} className="counter" color="green"> pts</Counter>
                        </div>
                        <div className="score">
                            <h2>Sophomore:&nbsp;</h2> 
                            <Counter start={0} end={cardinalympicsData[1]} duration = {2000} className="counter" color="purple"> pts</Counter>
                        </div>
                        <div className="score">
                            <h2>Junior:&nbsp;</h2> 
                            <Counter start={0} end={cardinalympicsData[2]} duration = {2000} className="counter" color="blue"> pts</Counter>
                        </div>
                        <div className="score">
                            <h2>Senior:&nbsp;</h2> 
                            <Counter start={0} end={cardinalympicsData[3]} duration = {2000} className="counter" color="#861212"> pts</Counter>
                        </div>
                </div>
                <Link to="Cardinalympics">Learn more</Link>
            </div> */}
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
  // Used by a commented-out block; still accepted as input for the page.
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
