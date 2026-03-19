import { useMemo, useState } from "react";
import announcements from "../config/announcements.config.js";

const INITIAL_VISIBLE = 9;
const LOAD_MORE_STEP = 9;
const PREVIEW_LENGTH = 120;

function toSortableDate(input) {
  if (!input) return null;
  const parsed = Date.parse(input);
  if (!Number.isNaN(parsed)) return new Date(parsed);

  const monthYear = String(input).trim().match(/^([A-Za-z]+)\s+(\d{4})$/);
  if (monthYear) {
    const [, monthName, year] = monthYear;
    const monthParsed = Date.parse(`${monthName} 1, ${year}`);
    if (!Number.isNaN(monthParsed)) return new Date(monthParsed);
  }
  return null;
}

function toMonthValue(input) {
  const d = toSortableDate(input);
  if (!d) return "";
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function trimPreview(text) {
  if (!text || text.length <= PREVIEW_LENGTH) return text || "";
  return `${text.slice(0, PREVIEW_LENGTH).trimEnd()}...`;
}

export default function Announcements() {
  const [query, setQuery] = useState("");
  const [fromMonth, setFromMonth] = useState("");
  const [toMonth, setToMonth] = useState("");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const [openId, setOpenId] = useState(null);

  const normalized = useMemo(
    () =>
      announcements
        .map((item, index) => ({
          ...item,
          id: `${item.title}-${index}`,
          sortDate: toSortableDate(item.date),
          monthValue: toMonthValue(item.date),
        }))
        .sort((a, b) => {
          if (!a.sortDate && !b.sortDate) return 0;
          if (!a.sortDate) return 1;
          if (!b.sortDate) return -1;
          return b.sortDate.getTime() - a.sortDate.getTime();
        }),
    []
  );

  const filteredAnnouncements = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const from = fromMonth || "";
    const to = toMonth || "";

    return normalized.filter((item) => {
      const searchable = `${item.title} ${item.content}`.toLowerCase();
      const matchesQuery =
        !normalizedQuery || searchable.includes(normalizedQuery);
      const matchesFrom = !from || (item.monthValue && item.monthValue >= from);
      const matchesTo = !to || (item.monthValue && item.monthValue <= to);
      return matchesQuery && matchesFrom && matchesTo;
    });
  }, [normalized, query, fromMonth, toMonth]);

  const visibleAnnouncements = filteredAnnouncements.slice(0, visibleCount);
  const hasMore = filteredAnnouncements.length > visibleCount;

  return (
    <section className="announcements-page info-page">
      <div className="announcements-page__header">
        <h1>All Announcements</h1>
        <p>Search and filter updates by month, then click a card for full details.</p>
      </div>

      <div className="announcements-toolbar">
        <label className="announcements-field">
          <span>Search</span>
          <input
            type="search"
            placeholder="Search title or content..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setVisibleCount(INITIAL_VISIBLE);
              setOpenId(null);
            }}
          />
        </label>

        <label className="announcements-field">
          <span>From month</span>
          <input
            type="month"
            value={fromMonth}
            onChange={(e) => {
              setFromMonth(e.target.value);
              setVisibleCount(INITIAL_VISIBLE);
              setOpenId(null);
            }}
          />
        </label>

        <label className="announcements-field">
          <span>To month</span>
          <input
            type="month"
            value={toMonth}
            onChange={(e) => {
              setToMonth(e.target.value);
              setVisibleCount(INITIAL_VISIBLE);
              setOpenId(null);
            }}
          />
        </label>
      </div>

      <p className="announcements-count">
        Showing {visibleAnnouncements.length} of {filteredAnnouncements.length} announcements
      </p>

      <div className="announcements-grid">
        {visibleAnnouncements.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div className="announcement-card-shell" key={item.id}>
              <button
                type="button"
                className="announcement-card"
                aria-expanded={isOpen}
                onClick={() => setOpenId(isOpen ? null : item.id)}
              >
                <h3>{item.title}</h3>
                <p className="announcement-card-date">{item.date}</p>
                <p className="announcement-card-preview">{trimPreview(item.content)}</p>
                <p className="announcement-card-cta">
                  {isOpen ? "Hide details" : "View details"}
                </p>
              </button>

              {isOpen && (
                <div className="announcement-popup" role="dialog" aria-label={item.title}>
                  <div className="announcement-popup-header">
                    <h4>{item.title}</h4>
                    <button
                      type="button"
                      aria-label="Close details"
                      onClick={() => setOpenId(null)}
                    >
                      ×
                    </button>
                  </div>
                  <p className="announcement-popup-date">{item.date}</p>
                  <p className="announcement-popup-content">{item.content}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {hasMore && (
        <button
          type="button"
          className="announcements-load-more"
          onClick={() => setVisibleCount((count) => count + LOAD_MORE_STEP)}
        >
          Load more announcements
        </button>
      )}
    </section>
  );
}
