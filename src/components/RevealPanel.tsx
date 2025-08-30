import React from 'react';
import { useGame } from '../state/GameContext';
import '../styles/RevealPanel.css';

const RevealPanel: React.FC = () => {
  const { state, actions } = useGame();
  const { rules, revealed } = state;

  if (!revealed) return null;

  return (
    <div className="reveal-panel">
      <div className="panel-header">
        <h2>🎉 Timeline Restored! 🎉</h2>
        <p>Here are the hidden rules you discovered:</p>
      </div>
      
      <div className="rules-container">
        {rules.map((rule, index) => (
          <div key={rule.id} className={`rule-card ${rule.type}`}>
            <div className="rule-header">
              <span className="rule-type">{rule.type.toUpperCase()}</span>
              <span className="rule-number">#{index + 1}</span>
            </div>
            <div className="rule-description">
              {rule.description}
            </div>
            <div className="rule-status">
              <span className={`status ${rule.satisfied ? 'satisfied' : 'unsatisfied'}`}>
                {rule.satisfied ? '✓ Satisfied' : '✗ Unsatisfied'}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="panel-actions">
        <button className="btn" onClick={actions.newPuzzle}>
          Next Puzzle
        </button>
        <button className="btn ghost" onClick={actions.resetPuzzle}>
          Try Again
        </button>
      </div>
      
      <div className="congratulations">
        <h3>🎯 Excellent Deduction!</h3>
        <p>
          You've successfully restored the temporal harmony by discovering the hidden 
          causal matrix. Your logical reasoning skills are truly impressive!
        </p>
      </div>
    </div>
  );
};

export default RevealPanel;
