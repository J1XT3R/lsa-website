import { Link, useSearchParams } from "react-router-dom";
import { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { getCategoryColorMap } from "../../config/clubs/index.js";

export default function Clubs({ clubData }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [visibleClubs, setVisibleClubs] = useState(9);
  const categoryFilter = searchParams.get("category");
  const colorMap = useMemo(() => getCategoryColorMap(), []);

  function loadMore() {
    setVisibleClubs((prev) => prev + 9);
  }

  function extractFileId(url) {
    const regex = /[?&]id=([^&]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  function getCategoryColor(category, useBackground = true) {
    const color = colorMap[category] || "gray";
    return useBackground
      ? { color: "white", background: color }
      : { color: "white", backgroundColor: color };
  }

  function renderClub(club, index) {
    const { Name, Category, Picture } = club;
    const clubColor = getCategoryColor(Category);

    return (
      <Link className="club-card" key={index} to={Name}>
        <div className="club-card__image-wrap">
          {Picture ? (
            <img
              className="club-card__image"
              src={`https://drive.google.com/thumbnail?id=${extractFileId(
                Picture
              )}&sz=w300`}
              alt={Name}
            />
          ) : (
            <div className="club-card__placeholder" style={{ background: clubColor.background || "var(--lowell-red)" }} />
          )}
          <span className="club-card__category" style={clubColor}>
            {Category}
          </span>
        </div>
        <h3 className="club-card__name">{Name}</h3>
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
      <button
        type="button"
        key={index}
        className={`clubs-page__filter-btn ${isActive ? "clubs-page__filter-btn--active" : ""}`}
        style={isActive ? clubColor : {}}
        onClick={() => setSearchParams({ category })}
      >
        {category}
      </button>
    );
  });

  return (
    <section className="clubs-page">
      <div className="clubs-page__hero">
        <h1>Clubs &amp; Sports</h1>
        <p className="clubs-page__tagline">
          Browse all registered clubs and sports at Lowell. Use filters to find by category.
        </p>
      </div>
      <div className="clubs-page__filters">
        <div className="clubs-page__filter-list">
          {filterButtons}
          {categoryFilter && (
            <button
              type="button"
              className="clubs-page__clear"
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
      <div className="clubs-page__grid">{displayClubs}</div>
      {!categoryFilter && visibleClubs < filteredClubs.length && (
        <div className="clubs-page__load-wrap">
          <button type="button" className="clubs-page__load" onClick={loadMore}>
            Load more clubs
          </button>
        </div>
      )}
    </section>
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
