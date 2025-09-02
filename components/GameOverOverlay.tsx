
import React from 'react';

interface GameOverOverlayProps {
  score: number;
  onRestart: () => void;
}

const GameOverOverlay: React.FC<GameOverOverlayProps> = ({ score, onRestart }) => {
  return (
    <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg animate-fade-in">
      <h2 className="text-5xl font-bold text-slate-800">Game Over!</h2>
      <p className="mt-2 text-slate-600">Your score: {score}</p>
      <button
        onClick={onRestart}
        className="mt-6 bg-sky-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-sky-600 transition-colors text-lg"
      >
        Try Again
      </button>
    </div>
  );
};

export default GameOverOverlay;
