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
              {!filterCategory.sex && <th>Gén.</th>}
              {filterCategory.sex && <th>Class.</th>}
              <th>Dos.</th>
              <th>Nom</th>
              {!filterCategory.sex && <th>Sexe</th>}
              {filterCategory.sex && <th>Gén.</th>}
              {!filterCategory.category && <th>Cat.</th>}
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
                {!filterCategory.sex && <td>{runner.ranking}</td>}
                {filterCategory.sex && <td>{filteredIndex + 1}</td>}
                <td>{runner.bib_number}</td>
                <td>{runner.name}</td>
                {!filterCategory.sex && <td>{runner.sex} ({runner.sex_ranking})</td>}
                {filterCategory.sex && <td>{runner.ranking}</td>}
                {!filterCategory.category && <td>{runner.category} ({runner.category_ranking})</td>}
                <td>{runner.time}</td>
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