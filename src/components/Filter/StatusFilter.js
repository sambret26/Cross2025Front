// Import libraries
import React from 'react';
import PropTypes from 'prop-types';

// Import styles
import './Filter.css';

const StatusFilter = ({ setStatus, setFilterOpen }) => {

  const status = [
    { "label": "Tous", "status": null },
    { "label": "Terminé", "status": 2 },
    { "label": "En cours", "status": 1 },
    { "label": "Abandoné", "status": -1 }
  ]

  const handleStatusChange = (status) => {
    setStatus(status);
    setFilterOpen(false);
  }

  return (
    <div className="filter-container">
      {status.map((status, index) => (
        <button
          key={`status-${index}`}
          className="filter-button"
          onClick={() => handleStatusChange(status)}
        >
          {status.label}
        </button>
      ))}
    </div>
  );
};

StatusFilter.propTypes = {
  setStatus: PropTypes.func.isRequired,
  setFilterOpen: PropTypes.func.isRequired
}

export default StatusFilter;
