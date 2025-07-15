// Import libraries
import React, { useState, useEffect, createContext, useMemo } from 'react';
import { Routes, Route } from 'react-router-dom';

// Import components
import Ranking from './components/Ranking/Ranking';
import Runner from './components/Runner/Runner';
import Home from './components/Home/Home'

// Import services
import { getRunners } from './service/runnerService';

// Import styles
import './App.css';

// Create context
export const GlobalContext = createContext();

function App() {
  const [runners, setRunners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRunners() {
      const runnersData = await getRunners();
      setRunners(runnersData);
      setLoading(false);
    }
    fetchRunners();
  }, []);

  const contextValue = useMemo(() => ({runners, loading}), [runners, loading]);

  const getAppRouter = () => {
    return (
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/runner/:number" element={<Runner/>} />
      </Routes>
    );
  }

  return (
    <GlobalContext.Provider value={contextValue}>
      <div className="app-container">
        {getAppRouter()}
      </div>
    </GlobalContext.Provider>
  )
}

export default App;
