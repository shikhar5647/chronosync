import React from 'react'
import { GameProvider, useGame } from './state/GameContext'
import TimelineGrid from './components/TimelineGrid'
import StabilityMeter from './components/StabilityMeter'
import RevealPanel from './components/RevealPanel'
import EraIntro from './components/EraIntro'

const GameShell: React.FC = () => {
    const { state, actions } = useGame()
    const { stability, solved, era, puzzleIndex } = state

    return (
        <div className="app-shell">
            <header className="topbar">
                <h1 className="logo">Chronosync</h1>
                <div className="topbar-right">
                    <button className="btn" onClick={actions.newPuzzle}>New Puzzle</button>
                    <button className="btn ghost" onClick={actions.resetPuzzle}>Reset</button>
                </div>
            </header>

            <main className="content">
                <aside className="sidebar">
                    <EraIntro />
                    <StabilityMeter value={stability} />
                </aside>
                <section className="board-wrap">
                    <TimelineGrid />
                    {solved && <RevealPanel />}
                </section>
            </main>

            <footer className="footer">
                <span>v0.1 • Dark Timeline Engine</span>
            </footer>
        </div>
    )
}

const App: React.FC = () => (
    <GameProvider>
        <GameShell />
    </GameProvider>
)

export default App