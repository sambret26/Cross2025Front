// Import libraries
import React, { useContext } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { GlobalContext } from '../../App';

// Import components
import Loader from '../Loader/Loader';

// Import styles
import './Runner.css';

const Runner = () => {

    const { number } = useParams();
    const [searchParams] = useSearchParams();
    const { runners, loading } = useContext(GlobalContext);
    const fromRanking = searchParams.get('fromRanking') === 'true';

    const runner = runners.find(runner => runner.bib_number === parseInt(number));

    const getCategorieLabel = (category) => {
        switch (category) {
            case 'J':
                return 'Jeune';
            case 'S':
                return 'Senior';
            default:
                return category;
        }
    }

    const getSexLabel = (sex) => {
        switch (sex) {
            case 'M':
                return 'Masculin';
            case 'F':
                return 'Feminin';
            default:
                return sex;
        }
    }

    if (loading) {
        return (
            <Loader/>
        )
    }

    if (!runner) {
        return (
            <div className="runner-container">
                <h2>Dossard non trouvé</h2>
            </div>
        );
    }

    return (
        <div className="runner-container">
            <h2>{fromRanking ? 'Profil' : 'Mon profil'}</h2>
            <div className="result-grid">
                <div className="result-line">
                    <div className="result-item">
                        <span className="label">Nom :</span>
                        <span className="value">{runner.name}</span>
                    </div>
                    <div className="result-item">
                        <span className="label">Dossard :</span>
                        <span className="value">#{runner.bib_number}</span>
                    </div>
                </div>
                
                <div className="result-line">
                    <div className="result-item">
                        <span className="label">Sexe :</span>
                        <span className="value">{getSexLabel(runner.sex)}</span>
                    </div>
                    <div className="result-item">
                        <span className="label">Catégorie :</span>
                        <span className="value">{getCategorieLabel(runner.category)}</span>
                    </div>
                </div>
            </div>
            <h2>{fromRanking ? 'Performance' : 'Ma performance'}</h2>
            <div className="result-grid-last">
                <div className="result-line">
                    <div className="result-item">
                        <span className="label">Temps :</span>
                        <span className="value">{runner.time}</span>
                    </div>
                    <div className="result-item">
                        <span className="label">Class. général :</span>
                        <span className="value">#{runner.ranking}</span>
                    </div>
                </div>
                
                <div className="result-line">
                    <div className="result-item">
                        <span className="label">Class. catégorie :</span>
                        <span className="value">#{runner.category_ranking}</span>
                    </div>
                    <div className="result-item">
                        <span className="label">Class. sexe :</span>
                        <span className="value">#{runner.sex_ranking}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Runner;
