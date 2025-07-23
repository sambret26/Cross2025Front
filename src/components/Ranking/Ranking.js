// Import libraries
import { useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { GlobalContext } from '../../App';
import { FiRefreshCw } from 'react-icons/fi';

// Import components
import Filter from '../Filter/Filter';
import Loader from '../Loader/Loader'

// Import image
import logo from '../../images/logo.png';

// Import styles
import './Ranking.css';

const Ranking = () => {

  const navigate = useNavigate();
  const { runners, loading, refreshData } = useContext(GlobalContext);
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
        <img src={logo} alt="Logo" className="ranking-logo"/>
        <h1>Classement</h1>
        <button
          className="refresh-button"
          onClick={refreshData}
          aria-label="Rafraîchir les données"
          title="Rafraîchir les données"
        >
          <FiRefreshCw className="refresh-icon" />
        </button>
      </header>
      <main className="runners-list">
        <table className="runners-table">
          <thead>
            <tr>
              {!filterCategory.sex &&
                <th>
                  <span className="table-header-label">Général</span>
                  <span className="table-header-short">Gén.</span>
                </th>
              }
              {filterCategory.sex &&
                <th>
                  <span className="table-header-label">Classement</span>
                  <span className="table-header-short">Cl.</span>
                </th>
              }
              <th>
                <span className="table-header-label">Dossard</span>
                <span className="table-header-short">N°</span>
              </th>
              <th>Nom</th>
              {!filterCategory.sex && <th>Sexe</th>}
              {filterCategory.sex &&
                <th>
                  <span className="table-header-label">Général</span>
                  <span className="table-header-short">Gén.</span>
                </th>
              }
              {!filterCategory.category &&
                <th>
                  <span className="table-header-label">Catégorie</span>
                  <span className="table-header-short">Cat.</span>
                </th>
              }
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
                <td colSpan="6">Aucun coureur n'a franchit la ligne d'arrivée</td>
              </tr>
            )}
          </tbody>
        </table>
      </main>
    </div>
  )
};

export default Ranking;