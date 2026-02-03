import Counter from "../components/Counter";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesDown } from "@fortawesome/free-solid-svg-icons";
import News from "./News";

const YOUTUBE_EMBED_URL = "https://www.youtube.com/embed/5TKdIrdcyJ4";
// eslint-disable-next-line no-unused-vars, react/prop-types
export default function Home({ cardinalympicsData, newsData }) {
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
      <div className="lsa-description center">
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
