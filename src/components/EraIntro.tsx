import React from 'react';
import { useGame } from '../state/GameContext';
import { ERAS } from '../utils/gameLogic';
import '../styles/EraIntro.css';

const EraIntro: React.FC = () => {
  const { state, actions } = useGame();
  const { era, puzzleIndex, difficulty } = state;
  const eraInfo = ERAS[era];

  const handleDifficultyChange = (newDifficulty: 'easy' | 'medium' | 'hard') => {
    actions.setDifficulty(newDifficulty);
  };

  return (
    <div className="era-intro">
      <div className="era-header">
        <h2 className="era-title" style={{ color: eraInfo?.color }}>
          {era}
        </h2>
        <div className="era-meta">
          <span className="puzzle-number">Puzzle #{puzzleIndex}</span>
          <span className="era-description">{eraInfo?.description}</span>
        </div>
      </div>
      
      <div className="era-narrative">
        <p>{eraInfo?.narrative}</p>
      </div>
      
      <div className="difficulty-selector">
        <h4>Difficulty</h4>
        <div className="difficulty-buttons">
          {(['easy', 'medium', 'hard'] as const).map(level => (
            <button
              key={level}
              className={`difficulty-btn ${difficulty === level ? 'active' : ''}`}
              onClick={() => handleDifficultyChange(level)}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      <div className="era-stats">
        <div className="stat">
          <span className="stat-label">Grid Size:</span>
          <span className="stat-value">5×5</span>
        </div>
        <div className="stat">
          <span className="stat-label">Max Value:</span>
          <span className="stat-value">5</span>
        </div>
        <div className="stat">
          <span className="stat-label">Rules:</span>
          <span className="stat-value">
            {difficulty === 'easy' ? '3' : difficulty === 'medium' ? '4' : '5'}
          </span>
        </div>
      </div>
      
      <div className="era-tips">
        <h4>💡 Temporal Tips</h4>
        <ul>
          <li>Watch the stability meter for instant feedback</li>
          <li>Start with simple changes to understand patterns</li>
          <li>Fixed cells (gray) cannot be changed</li>
          <li>Each rule affects specific cells in the grid</li>
        </ul>
      </div>
    </div>
  );
};

export default EraIntro;
