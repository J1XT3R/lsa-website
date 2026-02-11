import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const STATUS_OPEN_VALUES = ["open", "applications open"];

function getByKey(row, ...possibleKeys) {
  const keys = Object.keys(row || {});
  for (const want of possibleKeys) {
    const found = keys.find(k => String(k).trim().toLowerCase() === want.toLowerCase());
    if (found && row[found] != null && String(row[found]).trim() !== "") return String(row[found]).trim();
    if (row[want] != null && String(row[want]).trim() !== "") return String(row[want]).trim();
  }
  return "";
}

function normalizeRow(row) {
  if (!row || typeof row !== "object") return null;
  const name = getByKey(row, "Name of Org/Club", "Name", "name") || (row["Name of Org/Club"] ?? row["Name"] ?? row["name"] ?? "");
  const statusRaw = getByKey(row, "Status", "status") || (row["Status"] ?? row["status"] ?? "");
  const status = String(statusRaw).trim().toLowerCase();
  const dateAdded = getByKey(row, "Date Added", "dateAdded") || (row["Date Added"] ?? row["dateAdded"] ?? "");
  const notes = getByKey(row, "Notes", "notes") || (row["Notes"] ?? row["notes"] ?? "");
  const link = getByKey(row, "Application URL", "Link", "Application Link", "link") || (row["Application URL"] ?? row["Link"] ?? row["Application Link"] ?? row["link"] ?? "");
  return { name, status, dateAdded, notes, link };
}

function isApplicationOpen(row) {
  return STATUS_OPEN_VALUES.includes(row.status);
}

export default function ApplicationsOpen({ applicationsData = [] }) {
  const rows = (applicationsData || [])
    .map(normalizeRow)
    .filter((r) => r && r.name && r.name !== "Name of Org/Club" && !/^name of org\/club$/i.test(r.name.trim()));
  const openRows = rows.filter(isApplicationOpen);

  return (
    <section className="applications-open-page info-page">
      <div className="title">
        <h1>Clubs &amp; organizations with applications open</h1>
      </div>
      <div className="applications-open-intro">
        <p>Apply to the clubs and organizations below. Use the button on each card to go to the application.</p>
      </div>
      {openRows.length === 0 ? (
        <div className="applications-open-empty">
          <p>There are no applications open at the moment. Check back later or browse <Link to="/Clubs">all clubs</Link>.</p>
        </div>
      ) : (
        <div className="applications-open-list">
          {openRows.map((item, index) => (
            <div key={index} className="application-card">
              <h3 className="application-card-name">{item.name}</h3>
              {item.dateAdded && (
                <p className="application-card-date">Added: {item.dateAdded}</p>
              )}
              {item.notes && (
                <p className="application-card-notes">{item.notes}</p>
              )}
              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="application-card-button"
                >
                  Go to application →
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

ApplicationsOpen.propTypes = {
  applicationsData: PropTypes.arrayOf(PropTypes.object),
};
