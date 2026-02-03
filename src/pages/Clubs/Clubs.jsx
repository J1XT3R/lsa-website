import { Link, useSearchParams } from "react-router-dom";
import { useState, useMemo } from "react";
import PropTypes from "prop-types";

export default function Clubs({ clubData }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [visibleClubs, setVisibleClubs] = useState(9);
  const categoryFilter = searchParams.get("category");

  function loadMore() {
    setVisibleClubs((prev) => prev + 9);
  }

  function extractFileId(url) {
    const regex = /[?&]id=([^&]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  function getCategoryColor(category, useBackground = true) {
    const colorMap = {
      Sports: "red",
      VPA: "purple",
      "Volunteering and Public Service": "green",
      "Culture/Religion": "orange",
      Finance: "gold",
      "Food/Crafts": "brown",
      "Games and Fantasy": "darkblue",
      "Literature and Media": "teal",
      "Politics and Public Speaking": "lightcoral",
      "Visual and Performing Arts Club": "magenta",
      "Health and Environmental": "forestgreen",
      STEM: "#861212",
    };

    const color = colorMap[category] || "gray";
    return useBackground
      ? { color: "white", background: color }
      : { color: "white", backgroundColor: color };
  }

  function renderClub(club, index) {
    const { Name, Category, Picture } = club;
    const clubColor = getCategoryColor(Category);

    return (
      <Link className="clubs" key={index} to={Name}>
        <div className="club">
          {Picture && (
            <img
              src={`https://drive.google.com/thumbnail?id=${extractFileId(
                Picture
              )}&sz=w250`}
              alt={Name}
            />
          )}
          <p className="club-name">{Name}</p>
          <p style={clubColor} className="club-category">
            {Category}
          </p>
        </div>
      </Link>
    );
  }

  const filteredClubs = useMemo(() => {
    if (!categoryFilter) {
      return clubData;
    }
    return clubData.filter((club) => club.Category === categoryFilter);
  }, [clubData, categoryFilter]);

  const displayClubs = filteredClubs
    .slice(0, categoryFilter ? filteredClubs.length : visibleClubs)
    .map((club, index) => renderClub(club, index));

  const uniqueCategories = useMemo(() => {
    const categories = clubData.map((club) => club.Category);
    return [...new Set(categories)];
  }, [clubData]);

  const filterButtons = uniqueCategories.map((category, index) => {
    const clubColor = getCategoryColor(category, false);
    const isActive = categoryFilter === category;

    return (
      <div key={index}>
        <button
          style={isActive ? clubColor : {}}
          onClick={() => {
            setSearchParams({ category });
          }}
        >
          {category}
        </button>
      </div>
    );
  });

  return (
    <>
      <div className="title">
        <h1>All Registered Clubs and Sports</h1>
      </div>
      <div className="club-filters">
        <div className="filter-button">
          {filterButtons}
          {categoryFilter && (
            <button
              className="clear-button relative"
              onClick={() => {
                setSearchParams({});
                setVisibleClubs(9);
              }}
            >
              Clear filter
            </button>
          )}
        </div>
      </div>
      <div className="clubs">{displayClubs}</div>
      <div className="flex-center margin-1rem">
        {!categoryFilter && visibleClubs < filteredClubs.length && (
          <button className="load-button" onClick={loadMore}>
            Load More Clubs
          </button>
        )}
      </div>
    </>
  );
}

Clubs.propTypes = {
  clubData: PropTypes.arrayOf(
    PropTypes.shape({
      Name: PropTypes.string.isRequired,
      Category: PropTypes.string.isRequired,
      Picture: PropTypes.string,
      ClubDescription: PropTypes.string,
      MeetingDays: PropTypes.string,
      Weekly: PropTypes.string,
      MeetingPlaceTime: PropTypes.string,
      President: PropTypes.string,
      VP: PropTypes.string,
      OtherOfficers: PropTypes.string,
      Instagram: PropTypes.string,
      Banner: PropTypes.string,
    })
  ).isRequired,
};
