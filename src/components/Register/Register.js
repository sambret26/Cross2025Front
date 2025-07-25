// Import libraries
import { useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { GlobalContext } from '../../App';

// Import components
import CategoryFilter from '../Filter/CategoryFilter';
import StatusFilter from '../Filter/StatusFilter';
import Loader from '../Loader/Loader'

// Import styles
import '../Ranking/Ranking.css';
import './Register.css';

const Register = () => {

  const navigate = useNavigate();
  const { runners, loading } = useContext(GlobalContext);
  const [filterCategory, setFilterCategory] = useState({"label": "Général", "category": null, "sex": null});
  const [categoryFilterOpen, setCategoryFilterOpen] = useState(null);
  const [filterStatus, setFilterStatus] = useState({"label": "Tous", "status": null});
  const [statusFilterOpen, setStatusFilterOpen] = useState(null);

  const handleRunnerClick = (bib_number) => {
    navigate(`/runner/${bib_number}?fromRanking=true`);
  }

  const changeCategoryFilterOpen = () => {
    setCategoryFilterOpen(!categoryFilterOpen);
  }

  const changeStatusFilterOpen = () => {
    setStatusFilterOpen(!statusFilterOpen);
  }

  const isNotValid = (status, runner) => {
    console.log(status)
    if (status === 2 && !runner.finish) return true;
    if (status === -1 && !runner.out) return true;
    if (status === 1 && (runner.finish || runner.out)) return true;
    return false;
  }

  const getClassName = (filteredIndex, runner) => {
    let className = filteredIndex % 2 === 0 ? 'even-row' : 'odd-row';
    if (runner.finish) {
      className += ' finished-row';
    }
    if (runner.out) {
      className += ' out-row';
    }
    return className;
  }

  if (loading) {
    return(
      <Loader/>
    )
  };

  return (
    <div>
      {statusFilterOpen && (
        <>
          <StatusFilter
            setStatus={setFilterStatus}
            setFilterOpen={setStatusFilterOpen}
          />
        </>
      )}
      {categoryFilterOpen && (
        <>
          <CategoryFilter
            setCategory={setFilterCategory}
            setFilterOpen={setCategoryFilterOpen}
          />
        </>
      )}
      <button className="status-filter-opener" onClick={changeStatusFilterOpen}>
        {filterStatus.label}
      </button>
      <button className="category-filter-opener" onClick={changeCategoryFilterOpen}>
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
                if (filterStatus.status && isNotValid(filterStatus.status, runner)) return false;
                return true;
              })
              .sort((a, b) => {
                return a.bib_number - b.bib_number;
              })
              .map((runner, filteredIndex) => (
              <tr
                key={runner.id}
                className={getClassName(filteredIndex, runner)}
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
                <td colSpan="4">Aucun coureur n'est inscrit à l'épreuve</td>
              </tr>
            )}
          </tbody>
        </table>
      </main>
    </div>
  )
};

export default Register;