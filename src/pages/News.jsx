import PropTypes from "prop-types";

export default function News({ newsData }) {
  // use whatever we're passed or fall back to defaults so the page doesn't explode
  const newsItems = newsData || [
    {
      title: "Welcome to the New School Year!",
      date: "September 2025",
      content:
        "LSA is excited to welcome all students back to Lowell High School. Stay tuned for upcoming events and opportunities to get involved!",
    },
    {
      title: "Student Government Elections",
      date: "August 2025",
      content:
        "Congratulations to all newly elected board members. We look forward to working together to serve the Lowell community.",
    },
  ];

  return (
    <div className="news-section center">
      <h2>News & Announcements</h2>
      <div className="news-container">
        {newsItems.map((news, index) => (
          <div key={index} className="news-item">
            <h3>{news.title}</h3>
            <p className="news-date">{news.date}</p>
            <p className="news-content">{news.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

News.propTypes = {
  newsData: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
    })
  ),
};
