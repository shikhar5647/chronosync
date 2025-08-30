import React, { createContext, useContext, useReducer } from 'react';
import { GameState, GameAction } from '../types/game';
import { generatePuzzle, calculateStability } from '../utils/gameLogic';

// Initial state
const initialState: GameState = {
  era: 'Ancient Egypt',
  puzzleIndex: 1,
  grid: [],
  gridOriginal: [],
  fixed: [],
  rules: [],
  revealed: false,
  stability: 0,
  solved: false,
  difficulty: 'medium'
};

// Generate initial puzzle
const initialPuzzle = generatePuzzle({ 
  size: 5, 
  maxValue: 5, 
  fixedRatio: 0.4, 
  difficulty: 'medium' 
});

const initialStateWithPuzzle: GameState = {
  ...initialState,
  grid: initialPuzzle.grid.map(row => [...row]),
  gridOriginal: initialPuzzle.grid.map(row => [...row]),
  fixed: initialPuzzle.fixed,
  rules: initialPuzzle.rules,
  difficulty: initialPuzzle.difficulty,
  stability: calculateStability(initialPuzzle.grid, initialPuzzle.rules).percent,
  solved: calculateStability(initialPuzzle.grid, initialPuzzle.rules).percent >= 100
};

// Reducer function
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'MOVE': {
      const { row, col, value } = action;
      
      // Don't allow moves on fixed cells
      if (state.fixed[row][col]) return state;
      
      // Update the grid
      const newGrid = state.grid.map((gridRow, r) => 
        gridRow.map((cellValue, c) => 
          (r === row && c === col) ? value : cellValue
        )
      );
      
      // Recalculate stability
      const { percent } = calculateStability(newGrid, state.rules);
      const solved = percent >= 100;
      
      return {
        ...state,
        grid: newGrid,
        stability: percent,
        solved,
        revealed: solved ? true : state.revealed
      };
    }
    
    case 'RESET': {
      const { percent } = calculateStability(state.gridOriginal, state.rules);
      return {
        ...state,
        grid: state.gridOriginal.map(row => [...row]),
        stability: percent,
        solved: percent >= 100,
        revealed: false
      };
    }
    
    case 'NEW_PUZZLE': {
      const difficulty = action.difficulty || state.difficulty;
      const bundle = generatePuzzle({ 
        size: 5, 
        maxValue: 5, 
 fixedRatio: 0.4, 
        difficulty 
      });
      
      const { percent } = calculateStability(bundle.grid, bundle.rules);
      
      return {
        ...state,
        puzzleIndex: state.puzzleIndex + 1,
        grid: bundle.grid.map(row => [...row]),
        gridOriginal: bundle.grid.map(row => [...row]),
        fixed: bundle.fixed,
        rules: bundle.rules,
        difficulty: bundle.difficulty,
        revealed: false,
        stability: percent,
        solved: percent >= 100
      };
    }
    
    case 'REVEAL': {
      return { ...state, revealed: true };
    }
    
    case 'SET_DIFFICULTY': {
      const bundle = generatePuzzle({ 
        size: 5, 
        maxValue: 5, 
        fixedRatio: 0.4, 
        difficulty: action.difficulty 
      });
      
      const { percent } = calculateStability(bundle.grid, bundle.rules);
      
      return {
        ...state,
        puzzleIndex: 1,
        grid: bundle.grid.map(row => [...row]),
        gridOriginal: bundle.grid.map(row => [...row]),
        fixed: bundle.fixed,
        rules: bundle.rules,
        difficulty: action.difficulty,
        revealed: false,
        stability: percent,
        solved: percent >= 100
      };
    }
    
    default:
      return state;
  }
}

// Context interface
interface GameContextType {
  state: GameState;
  actions: {
    move: (row: number, col: number, value: number) => void;
    resetPuzzle: () => void;
    newPuzzle: () => void;
    reveal: () => void;
    setDifficulty: (difficulty: 'easy' | 'medium' | 'hard') => void;
  };
}

// Create context
const GameContext = createContext<GameContextType | null>(null);

// Provider component
export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialStateWithPuzzle);

  const actions = {
    move: (row: number, col: number, value: number) => {
      dispatch({ type: 'MOVE', row, col, value });
    },
    
    resetPuzzle: () => {
      dispatch({ type: 'RESET' });
    },
    
    newPuzzle: () => {
      dispatch({ type: 'NEW_PUZZLE' });
    },
    
    reveal: () => {
      dispatch({ type: 'REVEAL' });
    },
    
    setDifficulty: (difficulty: 'easy' | 'medium' | 'hard') => {
      dispatch({ type: 'SET_DIFFICULTY', difficulty });
    }
  };

  return (
    <GameContext.Provider value={{ state, actions }}>
      {children}
    </GameContext.Provider>
  );
};

// Hook to use the game context
export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
