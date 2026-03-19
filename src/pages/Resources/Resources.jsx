import { Link } from "react-router-dom";
import "./Resources.scss";

export default function Resources() {
  return (
    <div className="resource-page">
      <header className="resource-hero">
        <div className="title">
          <h1>Resources</h1>
        </div>
      </header>

      <div className="resource-content">
        <section className="resource-section">
          <h2 className="resource-section__heading">Get support</h2>
          <p>
            Lowell Student Association resources and referral pages for wellness and
            Title IX support.
          </p>

          <div className="resource-links" aria-label="Resource links">
            <Link to="/Wellness" className="resource-link-btn">
              Lowell Wellness Center
            </Link>
            <Link to="/TitleIX" className="resource-link-btn">
              Title IX Support
            </Link>
          </div>
        </section>

        <section className="resource-section">
          <h2 className="resource-section__heading">Other helpful pages</h2>
          <div className="resource-links" aria-label="Other pages links">
            <Link to="/ApplicationsOpen" className="resource-link-btn">
              Applications open
            </Link>
            <Link to="/Clubs" className="resource-link-btn">
              Browse clubs
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

