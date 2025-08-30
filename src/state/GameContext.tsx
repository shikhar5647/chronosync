import React, { createContext, useContext, useMemo, useReducer } from 'react'
const stability = recalcStability(grid, rules).percent
return {
    era: 'Ancient Egypt',
    puzzleIndex: 1,
    grid,
    fixed,
    rules,
    revealed: false,
    stability,
    solved: stability >= 100,
}
}


function reduce(state: GameState, action: GameAction): GameState {
    switch (action.type) {
        case 'MOVE': {
            const { r, c, value } = (action as MoveAction)
            if (state.fixed[r][c]) return state
            const grid = state.grid.map((row, ri) => row.map((v, ci) => (ri === r && ci === c ? value : v)))
            const { percent } = recalcStability(grid, state.rules)
            const solved = percent >= 100
            return { ...state, grid, stability: percent, solved, revealed: solved ? true : state.revealed }
        }
        case 'RESET': {
            const bundle: PuzzleBundle = { rules: state.rules, grid: state.gridOriginal ?? state.grid, fixed: state.fixed }
            const rules = state.rules
            const grid = state.gridOriginal ?? state.grid
            const fixed = state.fixed
            const { percent } = recalcStability(grid, rules)
            return { ...state, grid, fixed, rules, stability: percent, solved: percent >= 100, revealed: false }
        }
        case 'NEW_PUZZLE': {
            const bundle = generatePuzzle({ size: 5, maxValue: 5, fixedRatio: 0.4 })
            const { rules, grid, fixed } = bundle
            const { percent } = recalcStability(grid, rules)
            return {
                era: state.era, // keep same era for now
                puzzleIndex: state.puzzleIndex + 1,
                grid,
                gridOriginal: grid.map(r => [...r]),
                fixed,
                rules,
                revealed: false,
                stability: percent,
                solved: percent >= 100,
            }
        }
        case 'REVEAL': return { ...state, revealed: true }
        default: return state
    }
}


const GameCtx = createContext<{
    state: GameState; actions: {
        move: (r: number, c: number, value: number) => void
        resetPuzzle: () => void
        newPuzzle: () => void
        reveal: () => void
    }
} | null>(null)