// Import libraries
import { useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { GlobalContext } from '../../App';

// Import components
import Filter from '../Filter/Filter';
import Loader from '../Loader/Loader'

// Import styles
import '../Ranking/Ranking.css'

const Register = () => {

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
    return(
      <Loader/>
    )
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
        <h1>Inscrits</h1>
      </header>
      <main className="runners-list">
        <table className="runners-table">
          <thead>
            <tr>
              <th>Dos.</th>
              <th>Nom</th>
              <th>Sexe</th>
              <th>Cat.</th>
            </tr>
          </thead>
          <tbody>
            {runners
              ?.filter(runner => {
                if (filterCategory.category && runner.category !== filterCategory.category) return false;
                if (filterCategory.sex && runner.sex !== filterCategory.sex) return false;
                return true;
              })
              .sort((a, b) => {
                return a.bib_number - b.bib_number;
              })
              .map((runner, filteredIndex) => (
              <tr
                key={runner.id}
                className={filteredIndex % 2 === 0 ? 'even-row' : 'odd-row'}
                onClick={() => handleRunnerClick(runner.bib_number)}
              >
                <td>{runner.bib_number}</td>
                <td>{runner.name}</td>
                <td>{runner.sex}</td>
                <td>{runner.category}</td>
              </tr>
            ))}
            {!runners?.length && (
              <tr>
                <td colSpan="4">Aucun résultat</td>
              </tr>
            )}
          </tbody>
        </table>
      </main>
    </div>
  )
};

export default Register;