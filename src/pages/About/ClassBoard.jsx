import { useParams } from "react-router-dom";
import { useMemo } from "react";
import PropTypes from "prop-types";
import LoadingTruck from "../../components/LoadingTruck";

export default function ClassBoard({ officerData: officerDataProp }) {
  const params = useParams().BoardName;

  const officerData = useMemo(() => {
    if (!officerDataProp || !params) {
      return [];
    }
    return officerDataProp.filter((officer) => officer.Team === params);
  }, [officerDataProp, params]);

  function extractFileId(driveUrl) {
    const match = driveUrl.match(/[?&]id=([^&]+)/);
    return match ? match[1] : null; // Return the file ID if matched, otherwise null
  }

  const displayOfficers = officerData.map((officer, index) => {
    return (
      <div key={index}>
        <div className="team-member">
          <img
            src={`https://drive.google.com/thumbnail?id=${extractFileId(
              officer.Photo
            )}`}
            alt={officer.Name}
            className="team-member-photo"
          />
          <div>
            <h2>
              <span className="team-member-role" style={{ color: "#861212" }}>
                {officer.Role}
              </span>
              <span className="team-member-name"> {officer.Name}</span>
            </h2>
            <p className="team-member-description">{officer.Description}</p>
          </div>
        </div>
      </div>
    );
  });

  if (!officerData || officerData.length === 0) {
    return <LoadingTruck />;
  }

  return (
    <>
      <h1 className="team-name center">
        LSA {params}
        <br /> 2025-2026
      </h1>
      {/* <div className="team-info">
                    <p><strong>LOCATION - </strong>The Cave (Room 80A) during 1st block Leadership</p>
                    <p><strong>EMAIL - </strong>lowellhssbc@gmail.com</p>
                    <p><strong>INSTAGRAM - </strong>@lowellhs</p>
                    <p><strong>FACEBOOK PAGE - </strong>Lowell Student Association</p>
                </div> */}
      <div className="teams">{displayOfficers}</div>
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
