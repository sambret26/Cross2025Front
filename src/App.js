// Import libraries
import React, { useState, useEffect, createContext, useMemo } from 'react';
import { Routes, Route } from 'react-router-dom';

// Import components
import Register from './components/Register/Register'
import Ranking from './components/Ranking/Ranking';
import Runner from './components/Runner/Runner';
import Reward from './components/Reward/Reward';
import Home from './components/Home/Home'

// Import services
import { getCategories } from './service/categoryService';
import { getRunners } from './service/runnerService';

// Import styles
import './App.css';

// Create context
export const GlobalContext = createContext();

function App() {
  const [categories, setCategories] = useState([]);
  const [runners, setRunners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [runnersData, categoriesData] = await Promise.all([
          getRunners(),
          getCategories(),
        ]);
        setRunners(runnersData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const contextValue = useMemo(() =>
    ({runners, categories, loading}),
    [runners, categories, loading]
  );

  const getAppRouter = () => {
    return (
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/register" element={<Register />} />
        <Route path="/runner/:number" element={<Runner/>} />
        <Route path="/rewards" element={<Reward />} />
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
