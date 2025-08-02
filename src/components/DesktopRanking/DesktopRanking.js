import { useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect, useRef, useCallback } from 'react';
import { GlobalContext } from '../../App';
import Loader from '../Loader/Loader';
import './DesktopRanking.css';

// Scroll configuration constants
const SCROLL_CONFIG = {
  ROW_HEIGHT: 50,           // Approximate row height in pixels
  SCROLL_DELAY: 5000,        // Delay before starting scroll (5s)
  PAUSE_DURATION: 5000,      // Pause duration at top and bottom (5s)
  BASE_DURATION_PER_ROW: 1000, // Base duration per row (1s)
  MIN_SCROLL_DURATION: 5000   // Minimum scroll duration (5s)
};

const DesktopRanking = () => {

  const navigate = useNavigate();
  const { runners, categories } = useContext(GlobalContext);
  const [filterCategory, setFilterCategory] = useState(categories ? categories[0] : { "label": "Général", "category": null, "sex": null });
  const table1Ref = useRef(null);
  const [loading, setLoading] = useState(true);
  const [fiveSecondsPasts, setFiveSecondsPasts] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFiveSecondsPasts(true);
      console.log("Five seconds pasts");
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const updateFilterCategory = useCallback(() => {
    setFilterCategory(currentCategory => {
      const currentIndex = categories.findIndex(cat =>
        cat.category === currentCategory?.category &&
        cat.sex === currentCategory?.sex
      );
      const nextIndex = (currentIndex + 1) % categories.length;
      return categories[nextIndex];
    });
  }, [categories]);

  useEffect(() => {
    if (!categories || categories.length <= 1) return;
    setLoading(false);
    setFilterCategory(categories[0]);

    const interval = setInterval(() => {
      updateFilterCategory();
    }, 10000);

    return () => clearInterval(interval);
  }, [categories, updateFilterCategory]);

  // Custom hook for managing auto-scroll functionality
  const useAutoScroll = (tableRef) => {
    const animationRef = useRef(null);
    const startTimeoutRef = useRef(null);
    const isScrollingDownRef = useRef(true);
    const scrollFunctionsRef = useRef({});

    // Calculate scroll duration based on table content
    const calculateScrollDuration = useCallback((table) => {
      if (!table) return { duration: 0, hasContentToScroll: false };

      const { ROW_HEIGHT, MIN_SCROLL_DURATION, BASE_DURATION_PER_ROW } = SCROLL_CONFIG;
      const visibleRows = Math.ceil(table.clientHeight / ROW_HEIGHT);
      const totalRows = Math.ceil(table.scrollHeight / ROW_HEIGHT);
      const hiddenRows = Math.max(0, totalRows - visibleRows);

      return {
        duration: Math.max(MIN_SCROLL_DURATION, hiddenRows * BASE_DURATION_PER_ROW),
        hasContentToScroll: hiddenRows > 0
      };
    }, []);

    // Initialize scroll functions once
    useEffect(() => {
      // Reset scroll to top and prepare for next scroll down
      const resetScroll = (table) => {
        if (!table) return;

        table.scrollTo({ top: 0, behavior: 'instant' });

        startTimeoutRef.current = setTimeout(() => {
          const { duration } = calculateScrollDuration(table);
          isScrollingDownRef.current = true;
          scrollFunctionsRef.current.scrollDown(table, duration);
        }, SCROLL_CONFIG.PAUSE_DURATION);
      };

      // Handle the scroll down animation
      const scrollDown = (table, duration) => {
        if (!table) return;

        const startPos = table.scrollTop;
        const distance = table.scrollHeight - table.clientHeight - startPos;
        const startTime = performance.now();

        const step = (timestamp) => {
          const elapsed = timestamp - startTime;
          const progress = Math.min(elapsed / duration, 1);

          table.scrollTop = startPos + (distance * progress);

          if (progress < 1) {
            animationRef.current = requestAnimationFrame(step);
          } else {
            isScrollingDownRef.current = false;
            scrollFunctionsRef.current.resetScroll(table);
          }
        };

        animationRef.current = requestAnimationFrame(step);
      };

      // Store functions in ref to avoid dependency issues
      scrollFunctionsRef.current = { resetScroll, scrollDown };
    }, [calculateScrollDuration]);

    // Start the auto-scroll process
    const startAutoScroll = useCallback(() => {
      const table = tableRef.current;
      if (!table) return;

      const { duration, hasContentToScroll } = calculateScrollDuration(table);
      if (!hasContentToScroll) return;

      startTimeoutRef.current = setTimeout(() => {
        scrollFunctionsRef.current.scrollDown(table, duration);
      }, SCROLL_CONFIG.SCROLL_DELAY);
    }, [calculateScrollDuration, tableRef]);

    // Clean up all timeouts and animations
    const cleanup = useCallback(() => {
      if (startTimeoutRef.current) {
        clearTimeout(startTimeoutRef.current);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }, []);

    return { startAutoScroll, cleanup };
  };

  // Initialize auto-scroll
  const { startAutoScroll, cleanup } = useAutoScroll(table1Ref);

  useEffect(() => {
    if (fiveSecondsPasts) {
      startAutoScroll();
    }
    return cleanup;
  }, [fiveSecondsPasts, startAutoScroll, cleanup]);

  const handleRunnerClick = (bib_number) => {
    navigate(`/runner/${bib_number}?fromDesktopRanking=true`);
  }

  if (loading) {
    return (
      <Loader />
    )
  };

  return (
    <div>
      <header className="desktop-ranking-header">
        <h1>Classements 15 Août 2025</h1>
      </header>
      <main className="desktop-rankings-list">
        <div className="table-container">
          <h2 className="table-title">Classement général</h2>
          <table className="desktop-rankings-table-1-header">
            <thead>
              <tr>
                <th>Général</th>
                <th>Dossard</th>
                <th>Nom</th>
                <th>Sexe</th>
                <th>Catégorie</th>
                <th>Temps</th>
              </tr>
            </thead>
          </table>
          <div className="table-wrapper" ref={table1Ref}>
            <table className="desktop-rankings-table-1">
              <tbody>
                {runners
                  ?.filter(runner => runner.finish)
                  .map((runner, filteredIndex) => (
                    <tr
                      key={runner.id}
                      className={filteredIndex % 2 === 0 ? 'even-row' : 'odd-row'}
                      onClick={() => handleRunnerClick(runner.bib_number)}
                    >
                      <td>{runner.ranking}</td>
                      <td>{runner.bib_number}</td>
                      <td>{runner.name}</td>
                      <td>{runner.sex} ({runner.sex_ranking})</td>
                      <td>{runner.category} ({runner.category_ranking})</td>
                      <td>{runner.time}</td>
                    </tr>
                  ))}
                {!runners?.length && (
                  <tr>
                    <td colSpan="6">Aucun coureur n'a franchit la ligne d'arrivée</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="table-container">
          <h2 className="table-title">Classement {filterCategory?.label}</h2>
          <div className="table-wrapper">
            <table className="desktop-rankings-table-2">
              <thead>
                <tr>
                  <th>Classement</th>
                  <th>Dossard</th>
                  <th>Nom</th>
                  <th>Général</th>
                  <th>Temps</th>
                </tr>
              </thead>
              <tbody>
                {runners
                  ?.filter(runner => {
                    if (!runner.finish) return false;
                    if (filterCategory.category && runner.category !== filterCategory.category) return false;
                    return !(filterCategory.sex && runner.sex !== filterCategory.sex);
                  })
                  .map((runner, filteredIndex) => (
                    <tr
                      key={runner.id}
                      className={filteredIndex % 2 === 0 ? 'even-row' : 'odd-row'}
                      onClick={() => handleRunnerClick(runner.bib_number)}
                    >
                      <td>{runner.category_ranking}</td>
                      <td>{runner.bib_number}</td>
                      <td>{runner.name}</td>
                      <td>{runner.ranking}</td>
                      <td>{runner.time}</td>
                    </tr>
                  ))}
                {!runners?.length && (
                  <tr>
                    <td colSpan="6">Aucun coureur n'a franchit la ligne d'arrivée</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
};

export default DesktopRanking;