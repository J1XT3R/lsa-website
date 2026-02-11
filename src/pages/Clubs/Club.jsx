import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { GlowCapture, Glow } from "@codaworks/react-glow";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import LoadingTruck from "../../components/LoadingTruck";
import "../Clubs/Club.scss"; //update to module

export default function Club({ clubData: clubDataProp }) {
  const params = useParams().ClubName;
  const [clubData, setClubData] = useState(null);
  
  useEffect(() => {
    if (clubDataProp && params) {
      const foundClub = clubDataProp.find(
        (club) => club.Name && club.Name.trim() === params
      );
      setClubData(foundClub || null);
    }
  }, [params, clubDataProp]);

  function removeLeadingAt(str) {
    if (typeof str === "string") {
      return str.replace(/^@/, "");
    }
    return "";
  }

  if (!clubData) {
    return <LoadingTruck />;
  }
  function extractFileId(driveUrl) {
    const match = driveUrl.match(/[?&]id=([^&]+)/);
    return match ? match[1] : null; // Return the file ID if matched, otherwise null
  }

  return (
    <section>
      <div className="club-info">
        {clubData.Banner && (
          <iframe
            src={`https://drive.google.com/file/d/${extractFileId(
              clubData.Banner
            )}/preview?modestbranding=1&rel=0`}
            width="640"
            className="club-banner"
          ></iframe>
        )}
        <h1 className="club-title">{params}</h1>
        <p className="club-description">{clubData.ClubDescription}</p>
        <p className="meeting-times">
          <strong>Meetings: </strong>We meet every {clubData.MeetingDays}{" "}
          {clubData.Weekly} at {clubData.MeetingPlaceTime}
        </p>
      </div>
      <div className="club-officers">
        <h3>Club Officers:</h3>
        <p>
          <strong>President:</strong> {clubData.President}
        </p>
        <p>
          <strong>Vice President:</strong> {clubData.VP}
        </p>
        <p>
          <strong>Other Officers:</strong> {clubData.OtherOfficers}
        </p>
        {(clubData.Website || clubData.CustomWebsite) && (
          <a
            href={clubData.Website || clubData.CustomWebsite}
            className="link-button flex-center club-website-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit our website →
          </a>
        )}
        <GlowCapture>
          <Glow color="purple">
            {clubData.Instagram && (
              <a
                href={`https://www.instagram.com/${removeLeadingAt(
                  clubData.Instagram
                )}`}
                className="link-button flex-center"
                target="_blank"
              >
                Check out our Instagram{" "}
                <FontAwesomeIcon
                  icon={faInstagram}
                  className="instagram-icon"
                />
              </a>
            )}
          </Glow>
        </GlowCapture>
      </div>
    </section>
  );
}

Club.propTypes = {
  clubData: PropTypes.arrayOf(
    PropTypes.shape({
      Name: PropTypes.string,
      Banner: PropTypes.string,
      ClubDescription: PropTypes.string,
      MeetingDays: PropTypes.string,
      Weekly: PropTypes.string,
      MeetingPlaceTime: PropTypes.string,
      President: PropTypes.string,
      VP: PropTypes.string,
      OtherOfficers: PropTypes.string,
      Instagram: PropTypes.string,
      Website: PropTypes.string,
      CustomWebsite: PropTypes.string,
    })
  ).isRequired,
};
