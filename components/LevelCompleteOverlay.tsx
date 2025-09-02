import React from 'react';
import { Phrase } from '../types';

interface LevelCompleteOverlayProps {
  score: number;
  phrase: Phrase;
  onNextLevel: () => void;
}

const LevelCompleteOverlay: React.FC<LevelCompleteOverlayProps> = ({ score, phrase, onNextLevel }) => {
  return (
    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg animate-fade-in text-center p-4">
      <h2 className="text-4xl sm:text-5xl font-bold text-green-600">Level Complete!</h2>
      <p className="mt-2 text-slate-700 text-lg">You learned:</p>
      <p className="text-3xl font-bold text-slate-800">{phrase.name}</p>
      <p className="text-xl text-slate-500">({phrase.romaji})</p>
      <p className="mt-4 text-slate-600">Your score: {score}</p>
      <button
        onClick={onNextLevel}
        className="mt-6 bg-sky-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-sky-600 transition-colors text-lg"
      >
        Next Phrase
      </button>
    </div>
  );
};

export default LevelCompleteOverlay;
