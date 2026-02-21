import { useMemo } from "react";
import PropTypes from "prop-types";
import LoadingTruck from "../../components/LoadingTruck";
import "./About.scss";

export default function SBC({ officerData: officerDataProp }) {
  const officerData = useMemo(() => {
    if (!officerDataProp) {
      return [];
    }
    return officerDataProp.filter((officer) => officer.Team === "SBC");
  }, [officerDataProp]);

  function extractFileId(driveUrl) {
    const match = driveUrl?.match(/[?&]id=([^&]+)/);
    return match ? match[1] : null;
  }

  if (!officerDataProp) {
    return <LoadingTruck />;
  }

  return (
    <>
      <header className="board-hero">
        <h1 className="board-hero-title">Student Body Council</h1>
        <p className="board-hero-subtitle">SBC</p>
        <span className="board-hero-year">2025-2026</span>
      </header>

      <div className="board-contact">
        <span className="board-contact-item">
          <strong>Location</strong> — The Cave (Room 80A), 1st block Leadership
        </span>
        <span className="board-contact-item">
          <strong>Email</strong> — lowellhssbc@gmail.com
        </span>
        <span className="board-contact-item">
          <strong>Instagram</strong> — @lowellhs
        </span>
        <span className="board-contact-item">
          <strong>Facebook</strong> — Lowell Student Association
        </span>
      </div>

      <section className="board-officers">
        <h2 className="board-officers-heading">Meet the board</h2>
        <div className="board-officers-grid">
          {officerData.map((officer, index) => (
            <article key={index} className="board-officer-card">
              <div className="board-officer-card-photo-wrap">
                <img
                  src={`https://drive.google.com/thumbnail?id=${extractFileId(officer.Photo)}`}
                  alt={officer.Name}
                  className="board-officer-card-photo"
                />
              </div>
              {/* Single frame: bar by default, morphs into full popup on hover */}
              <div className="board-officer-card-frame">
                <div className="board-officer-card-frame-header">
                  <span className="board-officer-card-role">{officer.Role}</span>
                  <h3 className="board-officer-card-name">{officer.Name}</h3>
                </div>
                {officer.Description && (
                  <div className="board-officer-card-frame-body">
                    <p className="board-officer-card-preview">{officer.Description}</p>
                    <p className="board-officer-card-description">{officer.Description}</p>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

SBC.propTypes = {
  officerData: PropTypes.arrayOf(
    PropTypes.shape({
      Team: PropTypes.string.isRequired,
      Name: PropTypes.string.isRequired,
      Role: PropTypes.string.isRequired,
      Photo: PropTypes.string,
      Description: PropTypes.string,
    })
  ),
};
