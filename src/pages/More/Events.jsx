import { useMemo, useState } from "react";
import { useEffect, useRef } from "react";
import events from "../../config/events.config.js";
import "./Events.scss";

export default function Events() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeIndex, setActiveIndex] = useState(0);
  const timelineRef = useRef(null);

  const categories = useMemo(() => {
    const all = events.map((event) => event.category);
    return ["all", ...new Set(all)];
  }, []);

  const filteredEvents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return events.filter((event) => {
      const categoryMatch =
        selectedCategory === "all" || event.category === selectedCategory;

      if (!query) return categoryMatch;

      const text = [
        event.title,
        event.date,
        event.category,
        event.description,
        event.location,
      ]
        .join(" ")
        .toLowerCase();

      return categoryMatch && text.includes(query);
    });
  }, [searchQuery, selectedCategory]);

  /** At most 5 dots; window slides so the active event stays in view when there are more. */
  const DOT_MAX = 5;

  const visibleDots = useMemo(() => {
    const total = filteredEvents.length;
    if (total === 0) return [];
    if (total <= DOT_MAX) {
      return filteredEvents.map((event, index) => ({ event, index }));
    }
    const half = Math.floor((DOT_MAX - 1) / 2);
    const start = Math.min(
      Math.max(0, activeIndex - half),
      total - DOT_MAX
    );
    return Array.from({ length: DOT_MAX }, (_, i) => ({
      event: filteredEvents[start + i],
      index: start + i,
    }));
  }, [filteredEvents, activeIndex]);

  /** Dot size + gap scale from visible dot count (1–5). */
  const dotBarStyles = useMemo(() => {
    const count = Math.min(DOT_MAX, Math.max(1, filteredEvents.length));
    return {
      "--dot-count": String(count),
      "--dot-gap": `${Math.min(0.5, Math.max(0.1, 2.5 / count))}rem`,
      "--dot-size": `${Math.min(10, Math.max(5, Math.round(70 / count)))}px`,
    };
  }, [filteredEvents.length]);

  useEffect(() => {
    const el = timelineRef.current;
    if (!el || filteredEvents.length === 0) {
      setActiveIndex(0);
      return;
    }

    setActiveIndex((prev) =>
      Math.min(prev, Math.max(0, filteredEvents.length - 1))
    );

    /**
     * Active dot follows **equal scroll distance per event**: total horizontal scroll
     * is split into (n − 1) steps from first to last dot (or one dot if n === 1).
     * This adapts how far you scroll before the next dot highlights.
     */
    const getActiveIndexFromScroll = () => {
      const children = Array.from(el.querySelectorAll(".events-item"));
      const n = children.length;
      if (n <= 1) return 0;

      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 0) return 0;

      const t = Math.min(1, Math.max(0, el.scrollLeft / maxScroll));
      return Math.round(t * (n - 1));
    };

    const onScroll = () => {
      setActiveIndex(getActiveIndexFromScroll());
    };

    onScroll();
    const rafId = requestAnimationFrame(() => onScroll());

    el.addEventListener("scroll", onScroll, { passive: true });

    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(() => onScroll()) : null;
    ro?.observe(el);

    return () => {
      cancelAnimationFrame(rafId);
      el.removeEventListener("scroll", onScroll);
      ro?.disconnect();
    };
  }, [filteredEvents]);

  useEffect(() => {
    const el = timelineRef.current;
    if (!el) return;

    const normalizeWheelDelta = (delta, deltaMode) => {
      if (deltaMode === 1) return delta * 48; // line-based wheel (Windows mouse)
      if (deltaMode === 2) return delta * el.clientWidth; // page-based
      return delta; // pixel-based (trackpads)
    };

    const onWheel = (e) => {
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 0) return;

      // Force wheel interaction over timeline to move horizontally.
      e.preventDefault();
      const deltaX = normalizeWheelDelta(e.deltaX, e.deltaMode);
      const deltaY = normalizeWheelDelta(e.deltaY, e.deltaMode);

      // Prefer the strongest wheel axis and amplify enough to move across snap points.
      const axisDelta = Math.abs(deltaY) >= Math.abs(deltaX) ? deltaY : deltaX;
      el.scrollBy({ left: axisDelta * 2, behavior: "auto" });
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
    };
  }, []);

  const scrollToIndex = (index) => {
    const el = timelineRef.current;
    if (!el) return;
    const items = el.querySelectorAll(".events-item");
    if (!items[index]) return;

    const n = items.length;
    if (n <= 1) return;

    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) return;

    const targetLeft = (index / (n - 1)) * maxScroll;
    el.scrollTo({ left: targetLeft, behavior: "smooth" });
  };

  return (
    <section className="events-page">
      <header className="events-hero">
        <h1>Events Timeline</h1>
        <p>
          Browse upcoming Lowell events in a horizontal timeline. Scroll to explore
          what is happening throughout the year.
        </p>
      </header>

      <div className="events-controls" aria-label="Event filters">
        <div className="events-controls__field">
          <label htmlFor="events-search">Search events</label>
          <input
            id="events-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, date, location..."
          />
        </div>
        <div className="events-controls__field">
          <label htmlFor="events-category">Filter by category</label>
          <select
            id="events-category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === "all" ? "All categories" : category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="events-timeline-wrapper">
        <div className="events-timeline-shell">
          <div
            className="events-timeline"
            role="list"
            aria-label="Lowell events timeline"
            ref={timelineRef}
          >
            {filteredEvents.map((event) => (
              <article className="events-item" key={event.id} role="listitem">
                <div className="events-item__marker" aria-hidden>
                  <span className="events-item__date">{event.date}</span>
                  <span className="events-item__dot" />
                </div>

                <div className="events-card">
                  <h2 className="events-card__title">{event.title}</h2>
                  <p className="events-card__category">{event.category}</p>
                  <p className="events-card__description">{event.description}</p>
                  <p className="events-card__location">
                    <strong>Location:</strong> {event.location}
                  </p>
                </div>
              </article>
            ))}
            {filteredEvents.length === 0 && (
              <article className="events-empty" role="status" aria-live="polite">
                <h2>No events found</h2>
                <p>Try a different search query or category filter.</p>
              </article>
            )}
          </div>
        </div>

        {filteredEvents.length > 0 && (
          <div className="events-dot-scrollbar-wrap">
            <div
              className="events-dot-scrollbar"
              style={dotBarStyles}
              aria-label="Timeline position"
              data-dot-count={Math.min(DOT_MAX, filteredEvents.length)}
              data-overflow={filteredEvents.length > DOT_MAX ? "true" : "false"}
            >
              {visibleDots.map(({ event, index }) => (
                <button
                  key={`${event.id}-dot-${index}`}
                  type="button"
                  className={`events-dot-scrollbar__dot ${activeIndex === index ? "events-dot-scrollbar__dot--active" : ""}`}
                  onClick={() => scrollToIndex(index)}
                  aria-label={`Go to ${event.title}`}
                  aria-current={activeIndex === index ? "true" : undefined}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

