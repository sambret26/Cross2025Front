// Import libraries
import { useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { GlobalContext } from '../../App';
import { getRewards } from '../../service/categoryService';

// Import components
import Loader from '../Loader/Loader'

// Import styles
import './Reward.css';

const Reward = () => {

  const navigate = useNavigate();
  const { runners, loading } = useContext(GlobalContext);
  const [rewards, setRewards] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const rewardsData = await getRewards();
        setRewards(rewardsData);
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
      }
    }
    fetchData();
  }, []);

  const handleRunnerClick = (bib_number) => {
    navigate(`/runner/${bib_number}?fromRanking=true`);
  }

  const getName = (runner) => {
    if (runner.last_name && runner.first_name) {
      return runner.last_name + " " + runner.first_name;
    }
    return "";
  }

  if (loading) {
    return(
      <Loader/>
    )
  };

  return (
    <div>
      <header className="reward-header">
        <h1>Récompensés</h1>
      </header>
      <main className="reward-list">
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
            {rewards
              ?.map((reward, filteredIndex) => (
              <tr
                key={reward.id}
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
            {!rewards?.length && (
              <tr>
                <td colSpan="6">Aucun coureur n'a franchit la ligne d'arrivée</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="reward-list-footer">Arrivés : ({runners.filter(runner => runner.finish).length}/{runners.filter(runner => !runner.out).length})</div>
      </main>
    </div>
  )
};

export default Reward;