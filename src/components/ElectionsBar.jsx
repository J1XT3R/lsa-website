import { Link } from "react-router-dom";
import PropTypes from "prop-types";

/**
 * Bar shown when state is "polling" (e.g. "Polling for results").
 */
export default function ElectionsBar({ config }) {
  if (!config?.pollingBar?.enabled) return null;

  const { message, resultsLabel, resultsPath } = config.pollingBar;

  return (
    <div className="elections-bar">
      <div className="elections-bar-inner">
        <span className="elections-bar-message">{message}</span>
        {resultsPath && (
          <Link to={resultsPath} className="elections-bar-link">
            {resultsLabel ?? "Results"}
          </Link>
        )}
      </div>
    </div>
  );
}

ElectionsBar.propTypes = {
  config: PropTypes.shape({
    pollingBar: PropTypes.shape({
      enabled: PropTypes.bool,
      message: PropTypes.string,
      resultsLabel: PropTypes.string,
      resultsPath: PropTypes.string,
    }),
  }),
};
