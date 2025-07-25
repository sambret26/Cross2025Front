// Import libraries
import { useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect, useRef } from 'react';
import { GlobalContext } from '../../App';

// Import components
import Loader from '../Loader/Loader'

// Import styles
import './DesktopRanking.css';

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

  useEffect(() => {
    if (!categories || categories.length <= 1) return;
    setLoading(false);
    setFilterCategory(categories[0]);

    const interval = setInterval(() => {
      setFilterCategory(currentCategory => {
        const currentIndex = categories.findIndex(cat =>
          cat.category === currentCategory?.category &&
          cat.sex === currentCategory?.sex
        );
        const nextIndex = (currentIndex + 1) % categories.length;
        return categories[nextIndex];
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [categories]);

  useEffect(() => {
    const table1 = table1Ref.current;
    if (!table1) return;

    // Calculer le nombre de lignes visibles et totales
    const rowHeight = 50; // Hauteur approximative d'une ligne en pixels
    const visibleRows = Math.ceil(table1.clientHeight / rowHeight);
    const totalRows = Math.ceil(table1.scrollHeight / rowHeight);
    const hiddenRows = Math.max(0, totalRows - visibleRows);

    // Si pas de défilement nécessaire, on ne fait rien
    if (hiddenRows <= 0) return;

    // Durée de base par ligne (en millisecondes)
    const baseDurationPerRow = 1000; // 1s par ligne
    // Durée totale basée sur le nombre de lignes à défiler
    const scrollDuration = Math.max(5000, hiddenRows * baseDurationPerRow); // Minimum 5 secondes
    const pauseDuration = 5000; // 5 secondes de pause en haut

    let animationId;
    let startTime;
    let isScrollingDown = true;

    const scrollStep = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      if (isScrollingDown) {
        const scrollHeight = table1.scrollHeight - table1.clientHeight;

        if (scrollHeight > 0) {
          const progress = Math.min(elapsed / scrollDuration, 1);
          const scrollPosition = progress * scrollHeight;

          table1.scrollTop = scrollPosition;

          if (progress < 1) {
            animationId = requestAnimationFrame(scrollStep);
          } else {
            isScrollingDown = false;
            startTime = timestamp;

            // Pause en bas du tableau
            setTimeout(() => {

              table1.scrollTo({ top: 0, behavior: 'instant' });

              // Pause en haut du tableau avant de redescendre
              setTimeout(() => {
                startTime = undefined;
                isScrollingDown = true;
                animationId = requestAnimationFrame(scrollStep);
              }, pauseDuration);
            }, pauseDuration);
          }
        }
      }
    };

    // Démarrer après un court délai
    const startTimeout = setTimeout(() => {
      if (hiddenRows > 0) {
        animationId = requestAnimationFrame(scrollStep);
      }
    }, 5000);

    // Nettoyage
    return () => {
      clearTimeout(startTimeout);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [fiveSecondsPasts]);

  const handleRunnerClick = (bib_number) => {
    navigate(`/runner/${bib_number}?fromRanking=true`);
  }

  if (loading) {
    return (
      <Loader />
    )
  };

  return (
    <div>
      <header className="desktop-ranking-header">
        <h1>Classements</h1>
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
                  ?.filter(runner => {
                    if (!runner.finish) return false;
                    return true;
                  })
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
                    if (filterCategory.sex && runner.sex !== filterCategory.sex) return false;
                    return true;
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