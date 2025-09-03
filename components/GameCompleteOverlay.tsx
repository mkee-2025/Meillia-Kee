import React from 'react';

interface GameCompleteOverlayProps {
  onRestart: () => void;
}

const GameCompleteOverlay: React.FC<GameCompleteOverlayProps> = ({ onRestart }) => {
  return (
    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg animate-fade-in text-center p-4">
      <h2 className="text-[3em] font-bold text-sky-500">Congratulations!</h2>
      <p className="mt-[0.5em] text-slate-700 text-[1.2em]">You've learned all the phrases!</p>
      <button
        onClick={onRestart}
        className="mt-[1.5em] bg-green-500 text-white font-bold py-[0.75em] px-[1.5em] rounded-lg hover:bg-green-600 transition-colors text-[1.2em]"
      >
        Play Again
      </button>
    </div>
  );
};

export default GameCompleteOverlay;