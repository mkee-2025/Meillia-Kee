import React from 'react';

interface GameCompleteOverlayProps {
  onRestart: () => void;
}

const GameCompleteOverlay: React.FC<GameCompleteOverlayProps> = ({ onRestart }) => {
  return (
    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg animate-fade-in text-center p-4">
      <h2 className="text-4xl sm:text-5xl font-bold text-sky-500">Congratulations!</h2>
      <p className="mt-2 text-slate-700 text-lg">You've learned all the phrases!</p>
      <button
        onClick={onRestart}
        className="mt-6 bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition-colors text-lg"
      >
        Play Again
      </button>
    </div>
  );
};

export default GameCompleteOverlay;
