// Import libraries
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// Import components
import InputModal from '../Modal/InputModal';
import CommentModal from '../Modal/CommentModal';

// Import images
import logo from "../../images/logo.png"

// Import styles
import './Home.css';

const Home = () => {

  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

  const handleOpenInputModal = (e) => {
    e.preventDefault();
    setIsInputModalOpen(true);
  };

  const handleCloseInputModal = () => {
    setIsInputModalOpen(false);
  };

  const handleOpenCommentModal = (e) => {
    e.preventDefault();
    setIsCommentModalOpen(true);
  };

  const handleCloseCommentModal = () => {
    setIsCommentModalOpen(false);
  };

  useEffect(() => {
    let unblock = null;

    const handleBackButton = (event) => {
      if (isInputModalOpen || isCommentModalOpen) {
        event.preventDefault();
        event.stopPropagation();
        setIsCommentModalOpen(false);
        setIsInputModalOpen(false);
        return false;
      }
    };

    // Gestion du retour navigateur
    if (isInputModalOpen || isCommentModalOpen) {
      unblock = window.history.pushState(null, '', window.location.href);
      window.onpopstate = handleBackButton;
    }

    // Gestion du bouton physique retour (mobile)
    document.addEventListener('backbutton', handleBackButton, true);

    return () => {
      if (unblock) {
        window.history.go(1);
        window.onpopstate = null;
      }
      document.removeEventListener('backbutton', handleBackButton, true);
    };
  }, [isInputModalOpen, isCommentModalOpen]);



  return (
    <div className="home-page">
      <div className="titles-container">
        <h1 className="event-title">Cross Oriol</h1>
        <h1 className="event-title">15 août 2025</h1>
      </div>
      <div className="content-container">
        <div className="button-container">
          <Link to="/ranking">
            <button className="nav-button">Classement général</button>
          </Link>
          <button className="nav-button" onClick={handleOpenInputModal}>
            Mon résultat
          </button>
          <div className="home-logo-container">
            <img src={logo} alt="Logo" className="home-logo" />
          </div>
        </div>
        <button className="comment-button" onClick={handleOpenCommentModal}>
          Laisser un commentaire à l'organisation
        </button>
      </div>
      {isInputModalOpen && <InputModal onClose={handleCloseInputModal} />}
      {isCommentModalOpen && <CommentModal onClose={handleCloseCommentModal} />}
    </div>
  );
};

export default Home;