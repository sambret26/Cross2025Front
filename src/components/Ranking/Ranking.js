// Import libraries
import { useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { GlobalContext } from '../../App';

// Import components
import Filter from '../Filter/Filter';

// Import styles
import './Ranking.css';

const Ranking = () => {

  const navigate = useNavigate();
  const { runners, loading } = useContext(GlobalContext);
  const [filterCategory, setFilterCategory] = useState({"label": "Général", "category": null, "sex": null});
  const [filterOpen, setFilterOpen] = useState(null);

  const getTime = (time) => {
    let newTime = time.split('.')[0];
    if (newTime.startsWith("00:")) {
      newTime = newTime.substring(3);
    }
    return newTime;
  }

  const handleRunnerClick = (bib_number) => {
    navigate(`/runner/${bib_number}?fromRanking=true`);
  }

  const changeFilterOpen = () => {
    setFilterOpen(!filterOpen);
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  };

  return (
    <div>
      {filterOpen && (
        <>
          <Filter
            setCategory={setFilterCategory}
            setFilterOpen={setFilterOpen}
          />
        </>
      )}
      <button className="filter-opener" onClick={changeFilterOpen}>
        {filterCategory.label}
      </button>
      <header className="ranking-header">
        <h1>Classement</h1>
      </header>
      <main className="runners-list">
        <table className="runners-table">
          <thead>
            <tr>
              <th>Gén.</th>
              <th>Dos.</th>
              <th>Nom</th>
              <th>Sexe</th>
              <th>Cat.</th>
              <th>Temps</th>
            </tr>
          </thead>
          <tbody>
            {runners
              ?.filter(runner => {
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
                <td>{runner.ranking}</td>
                <td>{runner.bib_number}</td>
                <td>{runner.name}</td>
                <td>{runner.sex} ({runner.sex_ranking})</td>
                <td>{runner.category} ({runner.category_ranking})</td>
                <td>{getTime(runner.time)}</td>
              </tr>
            ))}
            {!runners?.length && (
              <tr>
                <td colSpan="6">Aucun résultat</td>
              </tr>
            )}
          </tbody>
        </table>
      </main>
    </div>
  )
};

export default Ranking;