// Import libraries
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Import components
import InputModal from '../Modal/InputModal';

// Import styles
import './Home.css';

const Home = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = (e) => {
        e.preventDefault();
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };
    
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
                    <button className="nav-button" onClick={handleOpenModal}>
                        Mon résultat
                    </button>
                </div>
            </div>

            {isModalOpen && <InputModal onClose={handleCloseModal}/>}
        </div>
    );
};

export default Home;