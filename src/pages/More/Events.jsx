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

  useEffect(() => {
    const el = timelineRef.current;
    if (!el || filteredEvents.length === 0) {
      setActiveIndex(0);
      return;
    }

    const onScroll = () => {
      const children = Array.from(el.querySelectorAll(".events-item"));
      if (!children.length) return;

      const viewportCenter = el.scrollLeft + el.clientWidth / 2;
      let closestIdx = 0;
      let closestDist = Number.POSITIVE_INFINITY;

      children.forEach((child, idx) => {
        const center = child.offsetLeft + child.clientWidth / 2;
        const dist = Math.abs(center - viewportCenter);
        if (dist < closestDist) {
          closestDist = dist;
          closestIdx = idx;
        }
      });

      setActiveIndex(closestIdx);
    };

    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [filteredEvents]);

  const scrollToIndex = (index) => {
    const el = timelineRef.current;
    if (!el) return;
    const items = el.querySelectorAll(".events-item");
    const target = items[index];
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
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
          <div className="events-dot-scrollbar" aria-label="Timeline position">
            {filteredEvents.map((event, index) => (
              <button
                key={`${event.id}-dot`}
                type="button"
                className={`events-dot-scrollbar__dot ${activeIndex === index ? "events-dot-scrollbar__dot--active" : ""}`}
                onClick={() => scrollToIndex(index)}
                aria-label={`Go to ${event.title}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

