// Import libraries
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../../App';
import { useContext } from 'react';

// Import styles
import './Ranking.css';

const Ranking = () => {

  const navigate = useNavigate();
  const { runners, loading } = useContext(GlobalContext);

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

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  };

  return (
    <div>
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
            {runners?.map((runner, index) => (
              <tr
                key={runner.id}
                className={index % 2 === 0 ? 'even-row' : 'odd-row'}
                onClick={() => handleRunnerClick(runner.bib_number)}
              >
                <td>{index + 1}</td>
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