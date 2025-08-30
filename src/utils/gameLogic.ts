import { GameRule, PuzzleBundle, StabilityResult } from '../types/game';

// Rule generation functions
function generateSumRule(grid: number[][], difficulty: string): GameRule {
  const size = grid.length;
  const row = Math.floor(Math.random() * size);
  const modulo = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 5 : 6;
  const target = Math.floor(Math.random() * modulo);
  
  const cells = Array.from({ length: size }, (_, col) => ({ row, col }));
  
  return {
    id: `sum_row_${row}`,
    type: 'sum',
    target,
    modulo,
    cells,
    description: `Sum of Row ${row + 1} must equal ${target} (mod ${modulo})`,
    satisfied: false
  };
}

function generateProductRule(grid: number[][], difficulty: string): GameRule {
  const size = grid.length;
  const col = Math.floor(Math.random() * size);
  const modulo = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 5 : 6;
  const target = Math.floor(Math.random() * modulo);
  
  // Use first two cells and last cell
  const cells = [
    { row: 0, col },
    { row: 1, col },
    { row: size - 1, col }
  ];
  
  return {
    id: `product_col_${col}`,
    type: 'product',
    target,
    modulo,
    cells,
    description: `(Cell[0,${col}] × Cell[1,${col}]) must equal ${target} (mod ${modulo})`,
    satisfied: false
  };
}

function generateLogicalRule(grid: number[][], difficulty: string): GameRule {
  const size = grid.length;
  const row1 = Math.floor(Math.random() * size);
  const col1 = Math.floor(Math.random() * size);
  const row2 = Math.floor(Math.random() * size);
  const col2 = Math.floor(Math.random() * size);
  
  const cells = [
    { row: row1, col: col1 },
    { row: row2, col: col2 }
  ];
  
  const conditions = [
    'even',
    'odd',
    'greater than 2',
    'less than 3',
    'equals 0',
    'equals 1'
  ];
  
  const condition = conditions[Math.floor(Math.random() * conditions.length)];
  
  return {
    id: `logical_${row1}_${col1}_${row2}_${col2}`,
    type: 'logical',
    target: 1,
    cells,
    description: `If Cell[${row1 + 1},${col1 + 1}] is ${condition}, then Cell[${row2 + 1},${col2 + 1}] must be valid`,
    satisfied: false
  };
}

function generateOperatorRule(grid: number[][], difficulty: string): GameRule {
  const size = grid.length;
  const row1 = Math.floor(Math.random() * size);
  const col1 = Math.floor(Math.random() * size);
  const row2 = Math.floor(Math.random() * size);
  const col2 = Math.floor(Math.random() * size);
  const row3 = Math.floor(Math.random() * size);
  const col3 = Math.floor(Math.random() * size);
  
  const cells = [
    { row: row1, col: col1 },
    { row: row2, col: col2 },
    { row: row3, col: col3 }
  ];
  
  const operators = ['AND', 'OR', 'XOR'];
  const operator = operators[Math.floor(Math.random() * operators.length)];
  
  return {
    id: `operator_${row1}_${col1}_${row2}_${col2}_${row3}_${col3}`,
    type: 'operator',
    target: 1,
    cells,
    description: `(Cell[${row1 + 1},${col1 + 1}] ${operator} Cell[${row2 + 1},${col2 + 1}]) must equal Cell[${row3 + 1},${col3 + 1}]`,
    satisfied: false
  };
}

function generateSequenceRule(grid: number[][], difficulty: string): GameRule {
  const size = grid.length;
  const row = Math.floor(Math.random() * size);
  const modulo = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 5 : 6;
  const target = Math.floor(Math.random() * modulo);
  
  const cells = Array.from({ length: size }, (_, col) => ({ row, col }));
  
  return {
    id: `sequence_row_${row}`,
    type: 'sequence',
    target,
    modulo,
    cells,
    description: `Row ${row + 1} must form a valid sequence with target ${target} (mod ${modulo})`,
    satisfied: false
  };
}

// Rule validation functions
function validateSumRule(grid: number[][], rule: GameRule): boolean {
  if (rule.type !== 'sum' || !rule.modulo) return false;
  
  const sum = rule.cells.reduce((acc, { row, col }) => acc + grid[row][col], 0);
  return (sum % rule.modulo) === rule.target;
}

function validateProductRule(grid: number[][], rule: GameRule): boolean {
  if (rule.type !== 'product' || !rule.modulo || rule.cells.length < 3) return false;
  
  const [cell1, cell2, cell3] = rule.cells;
  const product = (grid[cell1.row][cell1.col] * grid[cell2.row][cell2.col]) % rule.modulo;
  return product === rule.target;
}

function validateLogicalRule(grid: number[][], rule: GameRule): boolean {
  if (rule.type !== 'logical' || rule.cells.length < 2) return false;
  
  const [cell1, cell2] = rule.cells;
  const value1 = grid[cell1.row][cell1.col];
  const value2 = grid[cell2.row][cell2.col];
  
  // Simple logical validation - can be expanded
  if (value1 === 0 && value2 === 0) return false;
  if (value1 === 1 && value2 === 1) return true;
  
  return true;
}

function validateOperatorRule(grid: number[][], rule: GameRule): boolean {
  if (rule.type !== 'operator' || rule.cells.length < 3) return false;
  
  const [cell1, cell2, cell3] = rule.cells;
  const val1 = grid[cell1.row][cell1.col];
  const val2 = grid[cell2.row][cell2.col];
  const val3 = grid[cell3.row][cell3.col];
  
  // Convert to binary and perform bitwise operations
  const binary1 = val1.toString(2).padStart(4, '0');
  const binary2 = val2.toString(2).padStart(4, '0');
  const binary3 = val3.toString(2).padStart(4, '0');
  
  // Simple XOR validation for now
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += (parseInt(binary1[i]) ^ parseInt(binary2[i])).toString();
  }
  
  return parseInt(result, 2) === val3;
}

function validateSequenceRule(grid: number[][], rule: GameRule): boolean {
  if (rule.type !== 'sequence' || !rule.modulo) return false;
  
  const values = rule.cells.map(({ row, col }) => grid[row][col]);
  const sorted = [...values].sort((a, b) => a - b);
  
  // Check if it forms a valid sequence
  for (let i = 1; i < sorted.length; i++) {
    if ((sorted[i] - sorted[i-1]) % rule.modulo !== 1) {
      return false;
    }
  }
  
  return true;
}

// Main validation function
export function validateRule(grid: number[][], rule: GameRule): boolean {
  switch (rule.type) {
    case 'sum':
      return validateSumRule(grid, rule);
    case 'product':
      return validateProductRule(grid, rule);
    case 'logical':
      return validateLogicalRule(grid, rule);
    case 'operator':
      return validateOperatorRule(grid, rule);
    case 'sequence':
      return validateSequenceRule(grid, rule);
    default:
      return false;
  }
}

// Stability calculation
export function calculateStability(grid: number[][], rules: GameRule[]): StabilityResult {
  const ruleResults = rules.map(rule => {
    const satisfied = validateRule(grid, rule);
    const score = satisfied ? 100 : 0;
    return { rule: { ...rule, satisfied }, satisfied, score };
  });
  
  const totalScore = ruleResults.reduce((sum, result) => sum + result.score, 0);
  const percent = Math.round(totalScore / rules.length);
  
  return { percent, ruleResults };
}

// Puzzle generation
export function generatePuzzle(options: { 
  size: number; 
  maxValue: number; 
  fixedRatio: number;
  difficulty: 'easy' | 'medium' | 'hard';
}): PuzzleBundle {
  const { size, maxValue, fixedRatio, difficulty } = options;
  
  // Generate a valid grid first
  const grid = Array.from({ length: size }, () => 
    Array.from({ length: size }, () => Math.floor(Math.random() * (maxValue + 1)))
  );
  
  // Generate rules based on difficulty
  const ruleCount = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5;
  const rules: GameRule[] = [];
  
  const ruleGenerators = [
    generateSumRule,
    generateProductRule,
    generateLogicalRule,
    generateOperatorRule,
    generateSequenceRule
  ];
  
  for (let i = 0; i < ruleCount; i++) {
    const generator = ruleGenerators[Math.floor(Math.random() * ruleGenerators.length)];
    const rule = generator(grid, difficulty);
    rules.push(rule);
  }
  
  // Generate fixed cells
  const fixed = Array.from({ length: size }, () => 
    Array.from({ length: size }, () => Math.random() < fixedRatio)
  );
  
  // Ensure the generated grid satisfies the rules
  const { percent } = calculateStability(grid, rules);
  if (percent < 100) {
    // Adjust grid to satisfy rules (simplified approach)
    rules.forEach(rule => {
      if (rule.type === 'sum' && rule.modulo) {
        const currentSum = rule.cells.reduce((sum, { row, col }) => sum + grid[row][col], 0);
        const targetSum = rule.target;
        const diff = (targetSum - currentSum + rule.modulo) % rule.modulo;
        
        if (diff > 0 && !fixed[rule.cells[0].row][rule.cells[0].col]) {
          grid[rule.cells[0].row][rule.cells[0].col] = (grid[rule.cells[0].row][rule.cells[0].col] + diff) % rule.modulo;
        }
      }
    });
  }
  
  return { rules, grid, fixed, difficulty };
}

// Era information
export const ERAS: Record<string, EraInfo> = {
  'Ancient Egypt': {
    name: 'Ancient Egypt',
    description: 'The Age of Pyramids and Pharaohs',
    narrative: 'The ancient builders have left behind a puzzle in the alignment of their sacred numbers. Restore the temporal harmony to unlock the secrets of the pyramids.',
    color: '#d4af37'
  },
  'Renaissance': {
    name: 'Renaissance',
    description: 'The Age of Discovery and Art',
    narrative: 'Leonardo da Vinci\'s workshop is in chaos! The order of his experiments has been scrambled. Restore the sequence to prevent a disastrous explosion.',
    color: '#8b4513'
  },
  'Industrial Revolution': {
    name: 'Industrial Revolution',
    description: 'The Age of Steam and Progress',
    narrative: 'The factory\'s mechanical sequence has been disrupted. Align the gears and restore the industrial rhythm before the machines break down.',
    color: '#696969'
  },
  'Digital Age': {
    name: 'Digital Age',
    description: 'The Age of Information and Code',
    narrative: 'The quantum computer\'s temporal algorithms have become corrupted. Fix the binary sequences to restore the digital timeline.',
    color: '#00ff00'
  },
  'Future': {
    name: 'Future',
    description: 'The Age of Time Travel',
    narrative: 'The temporal nexus has been fractured by an unknown force. Reconstruct the quantum timeline before reality itself collapses.',
    color: '#ff00ff'
  }
};
