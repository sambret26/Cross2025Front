// Import libraries
import React from 'react';
import PropTypes from 'prop-types';

// Import styles
import './Filter.css';

const StatusFilter = ({ currentRace, currentStatus, setRace, setStatus,setFilterOpen }) => {

  const racesList = [
    { "label": "Toutes les courses", "race" : null},
    { "label": "5 km", "race" : "5kms"},
    { "label": "10 km", "race" : "10kms"}
  ]

  const statusList = [
    { "label": "Tous", "status": null },
    { "label": "Terminé", "status": 2 },
    { "label": "En cours", "status": 1 },
    { "label": "Abandons", "status": -1 }
  ]

  const handleRaceChange = (race) => {
    setRace(race.race);
    setFilterOpen(false);
  }

  const handleStatusChange = (status) => {
    setStatus(status.status);
    setFilterOpen(false);
  }

  return (
    <div className="status-filter-container">
      <div className="status-filter-column">
        {racesList.map((raceItem) => (
          <button
            key={`race-${raceItem.label}`}
            className={`status-filter-button ${
              currentRace === raceItem.race ? "filter-button-active" : ""
            }`}
            onClick={() => handleRaceChange(raceItem)}
          >
            {raceItem.label}
          </button>
        ))}
      </div>
      <div className="status-filter-column">
        {statusList.map((statusItem) => (
          <button
            key={`status-${statusItem.label}`}
            className={`status-filter-button ${
              currentStatus === statusItem.status ? "filter-button-active" : ""
            }`}
            onClick={() => handleStatusChange(statusItem)}
          >
            {statusItem.label}
          </button>
        ))}
      </div>
    </div>
  );
};



StatusFilter.propTypes = {
  race: PropTypes.string,
  status: PropTypes.number,
  setRace: PropTypes.func.isRequired,
  setStatus: PropTypes.func.isRequired,
  setFilterOpen: PropTypes.func.isRequired
}

export default StatusFilter;
