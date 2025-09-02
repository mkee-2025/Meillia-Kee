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

  const { grid, score, bestScore, isGameOver, isLevelWon, move, resetGame, gameMap, finalTilesCollected } = useGameLogic(currentLevel);

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
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const currentPhrase = CLASSROOM_PHRASES[currentLevel];
  const finalChar = currentPhrase.characters[currentPhrase.characters.length - 1];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 font-sans">
      <div className="relative w-full max-w-md mx-auto">
        <Header 
          score={score} 
          bestScore={bestScore} 
          onNewGame={resetGame}
          level={currentLevel + 1}
          phrase={currentPhrase}
        />
        <main className="mt-4">
          <div className="flex justify-center items-center mb-3 bg-slate-200 p-2 rounded-lg">
            <p className="font-semibold text-slate-700 text-sm sm:text-base">
              Goal: Make 5 <span className="text-sky-600 font-bold">{finalChar.char}</span> tiles
              <span className="mx-2 text-slate-400">|</span>
              Collected: <span className="font-bold text-slate-900">{finalTilesCollected > 5 ? 5 : finalTilesCollected} / 5</span>
            </p>
          </div>
          <GameBoard grid={grid} onMove={move} gameMap={gameMap} />
        </main>
        <footer className="text-center mt-4 text-slate-500">
          <p>
            <strong>How to play:</strong> Use your arrow keys (or swipe) to move the tiles.
            When two tiles with the same Kana touch, they merge into the next one in the phrase!
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