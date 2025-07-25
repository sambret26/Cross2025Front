// Import libraries
import React, { useState } from 'react';
import PropTypes from 'prop-types';

// Import styles
import './Modal.css';

// Import service
import { sendComment } from '../../service/commentService';

const CommentModal = ({ onClose }) => {

  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      setError('Veuillez entrer un nom');
      return;
    }

    if (!comment) {
      setError('Veuillez entrer un commentaire');
      return;
    }

    setError('');
    sendComment(name, comment);
    onClose();
  };

  const handleClose = () => {
    setName('');
    setComment('');
    setError('');
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Entrez votre commentaire</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Qui êtes-vous ?"
            className="modal-input"
          />
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Votre commentaire"
            className="modal-input"
          />
          {error && <p className="error-message">{error}</p>}
          <div className="modal-buttons">
            <button type="button" className="modal-button cancel" onClick={handleClose}>
              Annuler
            </button>
            <button type="submit" className="modal-button submit">
              Envoyer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

CommentModal.propTypes = {
  onClose: PropTypes.func.isRequired
}

export default CommentModal;
