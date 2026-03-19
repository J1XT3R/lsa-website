import { useParams } from "react-router-dom";
import { useMemo } from "react";
import PropTypes from "prop-types";
import LoadingTruck from "../../components/LoadingTruck";
import SafeImage from "../../components/SafeImage";

export default function Committee({ officerData: allOfficers }) {
  const { CommitteeName: params } = useParams();

  const officerData = useMemo(() => {
    if (!allOfficers || !params) {
      return [];
    }
    return allOfficers.filter((officer) => officer.Team === params);
  }, [allOfficers, params]);

  function extractFileId(driveUrl) {
    const match = driveUrl?.match(/[?&]id=([^&]+)/);
    return match ? match[1] : null;
  }

  if (!allOfficers) {
    return <LoadingTruck />;
  }

  if (!officerData.length) {
    return (
      <div className="center">
        <h1 className="team-name">Committees {params}</h1>
        <p>No officers found for this committee.</p>
      </div>
    );
  }

  const committeeName = officerData[0]?.Team || params;

  const displayOfficers = officerData.map((officer, index) => (
    <div key={index} className="team-member">
      <SafeImage
        src={`https://drive.google.com/thumbnail?id=${extractFileId(
          officer.Photo
        )}`}
        alt={officer.Name}
        className="team-member-photo"
        variant="user"
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
  ));

  return (
    <>
      <h1 className="team-name center">
        {committeeName}
        <br /> 2025-2026
      </h1>

      <div className="teams">{displayOfficers}</div>
    </>
  );
}

Committee.propTypes = {
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
