// Import libraries
import React, { useState, useEffect, createContext, useMemo, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';

// Import components
import DesktopRanking from './components/DesktopRanking/DesktopRanking';
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

  const fetchCategories = useCallback(async () => {
    try {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error("Erreur lors du chargement des catégories :", error);
    }
  }, []);

  const fetchRunners = useCallback(async () => {
    try {
      const runnersData = await getRunners();
      setRunners(runnersData);
    } catch (error) {
      console.error("Erreur lors du chargement des données :", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchRunners();
    const intervalId = setInterval(fetchRunners, 10000);
    return () => clearInterval(intervalId);
  }, [fetchCategories, fetchRunners]);

  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      await Promise.all([fetchRunners(), fetchCategories()]);
    } catch (error) {
      console.error("Erreur lors du rafraîchissement des données :", error);
    } finally {
      setLoading(false);
    }
  }, [fetchRunners, fetchCategories]);

  const contextValue = useMemo(() => ({
    runners,
    categories,
    loading,
    refreshData
  }), [runners, categories, loading, refreshData]);

  const getAppRouter = () => {
    return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/register" element={<Register />} />
        <Route path="/runner/:number" element={<Runner />} />
        <Route path="/rewards" element={<Reward />} />
        <Route path="/desktop-ranking" element={<DesktopRanking />} />
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
