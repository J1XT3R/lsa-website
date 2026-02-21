import { useParams } from "react-router-dom";
import { useMemo } from "react";
import PropTypes from "prop-types";
import LoadingTruck from "../../components/LoadingTruck";
import "./About.scss";

export default function ClassBoard({ officerData: officerDataProp }) {
  const params = useParams().BoardName;

  const officerData = useMemo(() => {
    if (!officerDataProp || !params) {
      return [];
    }
    return officerDataProp.filter((officer) => officer.Team === params);
  }, [officerDataProp, params]);

  function extractFileId(driveUrl) {
    const match = driveUrl?.match(/[?&]id=([^&]+)/);
    return match ? match[1] : null;
  }

  if (!officerDataProp || !params) {
    return <LoadingTruck />;
  }

  if (officerData.length === 0) {
    return <LoadingTruck />;
  }

  return (
    <>
      <header className="board-hero board-hero--class">
        <h1 className="board-hero-title">LSA {params}</h1>
        <span className="board-hero-year">2025-2026</span>
      </header>

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

ClassBoard.propTypes = {
  officerData: PropTypes.arrayOf(
    PropTypes.shape({
      Team: PropTypes.string.isRequired,
      Name: PropTypes.string.isRequired,
      Role: PropTypes.string.isRequired,
      Photo: PropTypes.string,
      Description: PropTypes.string,
    })
  ).isRequired,
};
