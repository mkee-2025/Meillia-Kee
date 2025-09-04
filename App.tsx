import React, { useEffect, useCallback, useState } from 'react';
import GameBoard from './components/GameBoard';
import Header from './components/Header';
import GameOverOverlay from './components/GameOverOverlay';
import LevelCompleteOverlay from './components/LevelCompleteOverlay';
import GameCompleteOverlay from './components/GameCompleteOverlay';
import { useGameLogic } from './hooks/useGameLogic';
import { CLASSROOM_PHRASES } from './constants';


const App: React.FC = () => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  const { grid, score, bestScore, isGameOver, isLevelWon, move, resetGame, gameMap, phrasesCompleted } = useGameLogic(currentLevel);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (isGameOver || isLevelWon || gameComplete) return;

    switch (event.key) {
      case 'ArrowUp':
        move('up');
        break;
      case 'ArrowDown':
        move('down');
        break;
      case 'ArrowLeft':
        move('left');
        break;
      case 'ArrowRight':
        move('right');
        break;
    }
  }, [isGameOver, isLevelWon, gameComplete, move]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
  
  const handleNextLevel = () => {
    const nextLevel = currentLevel + 1;
    if (nextLevel < CLASSROOM_PHRASES.length) {
      setCurrentLevel(nextLevel);
    } else {
      setGameComplete(true);
    }
  };

  const handleRestartFromBeginning = () => {
    setGameComplete(false);
    setCurrentLevel(0);
    // The game will automatically reset via the useEffect in useGameLogic
  };

  if (!gameMap) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const currentPhrase = CLASSROOM_PHRASES[currentLevel];

  return (
    <div className="game-container w-full h-full flex items-center justify-center p-2">
      <div 
        className="relative w-full h-full max-w-[420px] max-h-[840px] aspect-[1/2] flex flex-col bg-slate-50 shadow-lg rounded-xl p-[2em] font-sans"
      >
        <Header 
          score={score} 
          bestScore={bestScore} 
          onNewGame={resetGame}
          level={currentLevel + 1}
          phrase={currentPhrase}
        />
        <main className="mt-[1.5em] flex-grow flex flex-col">
          <div className="flex justify-center items-center mb-[1em] bg-slate-200 p-[0.75em] rounded-lg">
            <p className="font-semibold text-slate-700 text-[1.2em]">
              Goal: Complete the phrase 5 times
              <span className="mx-2 text-slate-400">|</span>
              Completed: <span className="font-bold text-slate-900">{phrasesCompleted > 5 ? 5 : phrasesCompleted} / 5</span>
            </p>
          </div>
          <div className="flex-grow flex items-center justify-center">
             <GameBoard grid={grid} onMove={move} gameMap={gameMap} />
          </div>
        </main>
        <footer className="text-center mt-[1.5em] text-slate-500 text-[1em]">
          <p>
            <strong>How to play:</strong> Use your arrow keys (or swipe) to move the tiles.
            When two tiles with sequential Kana touch, they merge into the next one in the phrase!
          </p>
        </footer>
        {gameComplete && <GameCompleteOverlay onRestart={handleRestartFromBeginning} />}
        {isLevelWon && !gameComplete && <LevelCompleteOverlay score={score} phrase={currentPhrase} onNextLevel={handleNextLevel} />}
        {isGameOver && !isLevelWon && <GameOverOverlay score={score} onRestart={resetGame} />}
      </div>
    </div>
  );
};

export default App;
