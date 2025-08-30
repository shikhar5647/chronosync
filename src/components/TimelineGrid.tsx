import React, { useState } from 'react';
import { useGame } from '../state/GameContext';
import '../styles/TimelineGrid.css';

const TimelineGrid: React.FC = () => {
  const { state, actions } = useGame();
  const { grid, fixed, rules } = state;
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);

  const handleCellClick = (row: number, col: number) => {
    if (!fixed[row][col]) {
      setSelectedCell({ row, col });
    }
  };

  const handleValueSelect = (value: number) => {
    if (selectedCell) {
      actions.move(selectedCell.row, selectedCell.col, value);
      setSelectedCell(null);
    }
  };

  const getCellHighlight = (row: number, col: number) => {
    // Check if this cell is part of any rule
    const ruleCells = rules.flatMap(rule => rule.cells);
    const isRuleCell = ruleCells.some(cell => cell.row === row && cell.col === col);
    
    if (isRuleCell) {
      return 'rule-highlight';
    }
    
    return '';
  };

  if (!grid.length) return <div>Loading...</div>;

  return (
    <div className="timeline-grid-container">
      <div className="grid-header">
        <h2>Timeline Grid</h2>
        <p>Click on variable cells to change their values</p>
      </div>
      
      <div className="grid" style={{ '--size': grid.length } as React.CSSProperties}>
        {grid.map((row, rowIndex) => 
          row.map((value, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`cell ${fixed[rowIndex][colIndex] ? 'fixed' : 'variable'} ${getCellHighlight(rowIndex, colIndex)}`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
            >
              <span className="cell-value">{value}</span>
              {!fixed[rowIndex][colIndex] && (
                <span className="cell-indicator">✏️</span>
              )}
            </div>
          ))
        )}
      </div>

      {selectedCell && (
        <div className="value-selector">
          <div className="selector-header">
            <span>Select value for cell [{selectedCell.row + 1}, {selectedCell.col + 1}]</span>
            <button 
              className="close-btn"
              onClick={() => setSelectedCell(null)}
            >
              ×
            </button>
          </div>
          <div className="value-options">
            {[0, 1, 2, 3, 4, 5].map(value => (
              <button
                key={value}
                className="value-btn"
                onClick={() => handleValueSelect(value)}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimelineGrid;
