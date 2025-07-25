// Import libraries
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../../App'
import PropTypes from 'prop-types';

// Import styles
import './Modal.css';

const InputModal = ({ onClose }) => {

  const [number, setNumber] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { runners } = useContext(GlobalContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!number) {
      setError('Veuillez entrer un numéro de dossard');
      return;
    }

    if (runners.some(runner => runner.bib_number === parseInt(number))) {
      navigate(`/runner/${number}`);
    } else {
      setError('Dossard non trouvé. Veuillez réessayer.');
    }
  };

  const handleClose = () => {
    setNumber('');
    setError('');
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Entrez votre dossard</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="Numéro de dossard"
            className="modal-input"
            min="1"
          />
          {error && <p className="error-message">{error}</p>}
          <div className="modal-buttons">
            <button type="button" className="modal-button cancel" onClick={handleClose}>
              Annuler
            </button>
            <button type="submit" className="modal-button submit">
              Mon résultat
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

InputModal.propTypes = {
  onClose: PropTypes.func.isRequired
}

export default InputModal;
