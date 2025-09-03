
import React from 'react';

interface GameOverOverlayProps {
  score: number;
  onRestart: () => void;
}

const GameOverOverlay: React.FC<GameOverOverlayProps> = ({ score, onRestart }) => {
  return (
    <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg animate-fade-in">
      <h2 className="text-[3.5em] font-bold text-slate-800">Game Over!</h2>
      <p className="mt-[0.5em] text-slate-600 text-[1.2em]">Your score: {score}</p>
      <button
        onClick={onRestart}
        className="mt-[1.5em] bg-sky-500 text-white font-bold py-[0.75em] px-[1.5em] rounded-lg hover:bg-sky-600 transition-colors text-[1.2em]"
      >
        Try Again
      </button>
    </div>
  );
};

export default GameOverOverlay;