export interface GameRule {
  id: string;
  type: 'sum' | 'product' | 'logical' | 'operator' | 'sequence';
  target: number;
  modulo?: number;
  cells: Array<{ row: number; col: number }>;
  description: string;
  satisfied: boolean;
}

export interface GameState {
  era: string;
  puzzleIndex: number;
  grid: number[][];
  gridOriginal: number[][];
  fixed: boolean[][];
  rules: GameRule[];
  revealed: boolean;
  stability: number;
  solved: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface PuzzleBundle {
  rules: GameRule[];
  grid: number[][];
  fixed: boolean[][];
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface StabilityResult {
  percent: number;
  ruleResults: Array<{ rule: GameRule; satisfied: boolean; score: number }>;
}

export interface EraInfo {
  name: string;
  description: string;
  narrative: string;
  color: string;
}

export type GameAction = 
  | { type: 'MOVE'; row: number; col: number; value: number }
  | { type: 'RESET' }
  | { type: 'NEW_PUZZLE'; difficulty?: 'easy' | 'medium' | 'hard' }
  | { type: 'REVEAL' }
  | { type: 'SET_DIFFICULTY'; difficulty: 'easy' | 'medium' | 'hard' };
