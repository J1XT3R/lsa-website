import Counter from "../components/Counter";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesDown } from "@fortawesome/free-solid-svg-icons";
import News from "./News";
import { clubSpotlights } from "../config/clubs/index.js";
import { site } from "../config/site.config.js";
import ElectionBanner from "../components/ElectionBanner";

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

const STATUS_OPEN = ["open", "applications open"];
function getAppByKey(row, ...possibleKeys) {
  const keys = Object.keys(row || {});
  for (const want of possibleKeys) {
    const found = keys.find(k => String(k).trim().toLowerCase() === want.toLowerCase());
    if (found && row[found] != null && String(row[found]).trim() !== "") return String(row[found]).trim();
    if (row[want] != null && String(row[want]).trim() !== "") return String(row[want]).trim();
  }
  return "";
}
function normalizeAppRow(row) {
  if (!row || typeof row !== "object") return null;
  const name = getAppByKey(row, "Name of Org/Club", "Name", "name") || (row["Name of Org/Club"] ?? row["Name"] ?? row["name"] ?? "");
  const statusRaw = getAppByKey(row, "Status", "status") || (row["Status"] ?? "");
  const status = String(statusRaw).trim().toLowerCase();
  const dateAdded = getAppByKey(row, "Date Added", "dateAdded") || (row["Date Added"] ?? row["dateAdded"] ?? "");
  const notes = getAppByKey(row, "Notes", "notes") || (row["Notes"] ?? row["notes"] ?? "");
  const link = getAppByKey(row, "Application URL", "Link", "Application Link", "link") || (row["Application URL"] ?? row["Link"] ?? row["Application Link"] ?? row["link"] ?? "");
  return { name, status, dateAdded, notes, link };
}
function parseDateAdded(str) {
  if (!str) return 0;
  const parts = String(str).trim().split(/[/-]/);
  if (parts.length >= 3) {
    const m = parseInt(parts[0], 10);
    const d = parseInt(parts[1], 10);
    const y = parseInt(parts[2], 10);
    if (!isNaN(m) && !isNaN(d) && !isNaN(y)) return new Date(y, m - 1, d).getTime();
  }
  return new Date(str).getTime() || 0;
}

// eslint-disable-next-line no-unused-vars, react/prop-types
export default function Home({ cardinalympicsData, newsData, clubData = [], applicationsData = [] }) {
  const spotlights = clubSpotlights || [];
  const weekIndex = getWeekIndex();
  const spotlight = spotlights[weekIndex % spotlights.length];
  const spotlightClub = spotlight && clubData.find(
    (c) => c.Name && c.Name.trim().toLowerCase() === spotlight.clubName.trim().toLowerCase()
  );

  const applicationsOpenForNews = (applicationsData || [])
    .map(normalizeAppRow)
    .filter((r) => r && r.name && r.name !== "Name of Org/Club" && !/^name of org\/club$/i.test(r.name.trim()) && STATUS_OPEN.includes(r.status))
    .sort((a, b) => parseDateAdded(b.dateAdded) - parseDateAdded(a.dateAdded))
    .slice(0, 5);

  const showElectionBanner =
    site.electionsEnabled &&
    site.elections?.banner?.enabled &&
    (site.elections?.state === "contesting" || site.elections?.state === "polling");

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
        <div className="stats">
          <div className="center">
            <Counter start={0} end={2500} duration={2000} className="counter">
              +
            </Counter>
            <p>Students</p>
          </div>
          <div className="center">
            <Counter start={0} end={150} duration={2000} className="counter">
              +
            </Counter>
            <p>Clubs</p>
          </div>
          <div className="center">
            <Counter start={0} end={9000} duration={2000} className="counter">
              +
            </Counter>
            <p>Alumni</p>
          </div>
        </div>
      </div>
      {spotlight && (
        <div className="club-spotlight-section center">
          <h2>Club spotlight</h2>
          <div className="club-spotlight">
            {spotlightClub ? (
              <>
                {spotlightClub.Picture && (
                  <img
                    src={`https://drive.google.com/thumbnail?id=${extractFileId(spotlightClub.Picture)}&sz=w300`}
                    alt={spotlightClub.Name}
                    className="club-spotlight-img"
                  />
                )}
                <div className="club-spotlight-text">
                  <h3>{spotlightClub.Name}</h3>
                  <p>{spotlight.blurb || spotlightClub.ClubDescription}</p>
                  <Link to={`/Clubs/${encodeURIComponent(spotlightClub.Name)}`} className="club-spotlight-link">
                    Learn more →
                  </Link>
                </div>
              </>
            ) : (
              <div className="club-spotlight-text">
                <h3>{spotlight.clubName}</h3>
                <p>{spotlight.blurb}</p>
                <Link to="/Clubs" className="club-spotlight-link">Browse clubs →</Link>
              </div>
            )}
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
          <p className="center" style={{ marginTop: "1rem" }}>
            <Link to="/ApplicationsOpen">View all applications open →</Link>
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
