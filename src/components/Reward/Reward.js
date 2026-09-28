// Import libraries
import { useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { GlobalContext } from '../../App';
import { getRewards } from '../../service/categoryService';

// Import components
import Loader from '../Loader/Loader'

// Import constants
import { NO_RUNNER_NO_STARTED, NO_RUNNER_STARTED } from '../../Constants/constants';

// Import styles
import './Reward.css';

const Reward = () => {

  const navigate = useNavigate();
  const { runners, started, loading } = useContext(GlobalContext);
  const [rewards, setRewards] = useState([]);

  const runners5km = runners.filter(runner => runner.race_label === "5kms");
  const runners10km = runners.filter(runner => runner.race_label === "10kms");

  const rewards5km = rewards?.filter(reward => reward.race_label === "5kms") ?? [];
  const rewards10km = rewards?.filter(reward => reward.race_label === "10kms") ?? [];

  const hasReward5km = rewards5km.some(reward => reward.ranking !== null)
  const hasReward10km = rewards10km.some(reward => reward.ranking !== null)

  const fetchData = async () => {
    try {
      const rewardsData = await getRewards();
      setRewards(rewardsData);
    } catch (error) {
      console.error("Erreur lors du chargement des données :", error);
    }
  }

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const handleRunnerClick = (bib_number) => {
    navigate(`/runner/${bib_number}?from=/rewards`);
  }

  const getName = (runner) => {
    if (runner.last_name && runner.first_name) {
      return runner.last_name + " " + runner.first_name;
    }
    return "";
  }

  if (loading) {
    return (
      <Loader />
    )
  };

  return (
    <div>
      <header className="reward-header">
        <h1>Récompensés</h1>
      </header>
      <main className="reward-list">
        <div className="reward-table-container">
          <h2 className="reward-table-title">Récompensés 5 km</h2>
            <table className="reward-table">
              <thead>
                <tr>
                  <th>
                    <span className="table-header-label">Catégorie</span>
                    <span className="table-header-short">Cat.</span>
                  </th>
                  <th>
                    <span className="table-header-label">Classement</span>
                    <span className="table-header-short">Cl.</span>
                  </th>
                  <th>Nom</th>
                  <th>
                    <span className="table-header-label">Dossard</span>
                    <span className="table-header-short">N°</span>
                  </th>
                  <th>Temps</th>
                </tr>
              </thead>
              <tbody>
                {hasReward5km && rewards5km.map((reward, filteredIndex) => (
                    <tr
                      key={`${reward.race_label}-${reward.bib_number}`}
                      className={filteredIndex % 2 === 0 ? 'even-row' : 'odd-row'}
                      onClick={() => handleRunnerClick(reward.bib_number)}
                    >
                      <td>{reward.category + " " + reward.sex}</td>
                      <td>{reward.ranking}</td>
                      <td>{getName(reward)}</td>
                      <td>{reward.bib_number}</td>
                      <td>{reward.time}</td>
                    </tr>
                  ))}
                {!hasReward5km && (
                  <tr>
                    <td colSpan="6">
                      {started ? NO_RUNNER_STARTED : NO_RUNNER_NO_STARTED}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          <div className="reward-list-footer">Arrivés : ({runners5km.filter(runner => runner.finish).length}/{runners5km.filter(runner => !runner.out).length})</div>
        </div>
        <div className="reward-table-container">
          <h2 className="reward-table-title">Récompensés 10 km</h2>
            <table className="reward-table">
              <thead>
                <tr>
                  <th>
                    <span className="table-header-label">Catégorie</span>
                    <span className="table-header-short">Cat.</span>
                  </th>
                  <th>
                    <span className="table-header-label">Classement</span>
                    <span className="table-header-short">Cl.</span>
                  </th>
                  <th>Nom</th>
                  <th>
                    <span className="table-header-label">Dossard</span>
                    <span className="table-header-short">N°</span>
                  </th>
                  <th>Temps</th>
                </tr>
              </thead>
              <tbody>
                {hasReward10km && rewards10km.length && rewards10km.map((reward, filteredIndex) => (
                    <tr
                      key={`${reward.race_label}-${reward.bib_number}`}
                      className={filteredIndex % 2 === 0 ? 'even-row' : 'odd-row'}
                      onClick={() => handleRunnerClick(reward.bib_number)}
                    >
                      <td>{reward.category + " " + reward.sex}</td>
                      <td>{reward.ranking}</td>
                      <td>{getName(reward)}</td>
                      <td>{reward.bib_number}</td>
                      <td>{reward.time}</td>
                    </tr>
                  ))}
                {!hasReward10km && (
                  <tr>
                    <td colSpan="6">
                      {started ? NO_RUNNER_STARTED : NO_RUNNER_NO_STARTED}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          <div className="reward-list-footer">Arrivés : ({runners10km.filter(runner => runner.finish).length}/{runners10km.filter(runner => !runner.out).length})</div>
        </div>
      </main>
    </div>
  )
};

export default Reward;