import { useEffect, useMemo, useState } from "react";

const INITIAL_VISIBLE = 9;
const LOAD_MORE_STEP = 9;
const PREVIEW_LENGTH = 120;
const GOOGLE_API_KEY = "AIzaSyAgshc5Aqd8B149h5RpsenMh_SQAeb4AXc";
const ANNOUNCEMENTS_SPREADSHEET_ID = "1Kk7Bs58DAWZ9pHvqD-RFvoV1ePeThQ1Yr9c5RsDeAq4";
const ANNOUNCEMENTS_SHEET_NAMES = ["Annoucements Archive", "Announcements Archive", "Announcements"];

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

function parseSheetAnnouncements(values) {
  if (!Array.isArray(values) || values.length < 2) return [];
  const headers = values[0].map((h) => String(h || "").trim().toLowerCase());
  const titleIndex = headers.findIndex((h) => h === "name" || h === "title");
  const dateIndex = headers.findIndex((h) => h === "year" || h === "date");
  const contentIndex = headers.findIndex((h) => h === "description" || h === "content");
  if (titleIndex < 0 || contentIndex < 0) return [];

  return values
    .slice(1)
    .map((row) => ({
      title: String(row?.[titleIndex] ?? "").trim(),
      date: String(row?.[dateIndex] ?? "").trim() || "Unknown",
      content: String(row?.[contentIndex] ?? "").trim(),
    }))
    .filter((item) => item.title && item.content);
}

export default function Announcements() {
  const [sheetAnnouncements, setSheetAnnouncements] = useState([]);
  const [loadingSheet, setLoadingSheet] = useState(true);
  const [query, setQuery] = useState("");
  const [fromMonth, setFromMonth] = useState("");
  const [toMonth, setToMonth] = useState("");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchAnnouncementsFromSheet() {
      setLoadingSheet(true);
      try {
        for (const sheetName of ANNOUNCEMENTS_SHEET_NAMES) {
          const range = encodeURIComponent(sheetName);
          const url = `https://sheets.googleapis.com/v4/spreadsheets/${ANNOUNCEMENTS_SPREADSHEET_ID}/values/${range}?key=${GOOGLE_API_KEY}`;
          const res = await fetch(url);
          const json = await res.json();
          if (json?.error) continue;
          const parsed = parseSheetAnnouncements(json.values);
          if (parsed.length > 0) {
            if (!cancelled) setSheetAnnouncements(parsed);
            return;
          }
        }
      } catch (error) {
        console.warn("Announcements sheet fetch failed:", error);
      } finally {
        if (!cancelled) setLoadingSheet(false);
      }
    }

    fetchAnnouncementsFromSheet();
    return () => {
      cancelled = true;
    };
  }, []);

  const sourceAnnouncements = sheetAnnouncements;

  const normalized = useMemo(
    () =>
      sourceAnnouncements
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
    [sourceAnnouncements]
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
        <p>
          {loadingSheet
            ? "Loading annoucements"
            : "Search and filter updates by month, then click a card for full details."}
        </p>
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
        {!loadingSheet && visibleAnnouncements.length === 0 && (
          <p className="announcements-count">You're up to date!</p>
        )}
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
