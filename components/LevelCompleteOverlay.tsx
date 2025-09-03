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
      <h2 className="text-[3em] font-bold text-green-600">Level Complete!</h2>
      <p className="mt-[0.5em] text-slate-700 text-[1.2em]">You learned:</p>
      <p className="text-[2em] font-bold text-slate-800">{phrase.name}</p>
      <p className="text-[1.5em] text-slate-500">({phrase.romaji})</p>
      <p className="mt-[1em] text-slate-600 text-[1.1em]">Your score: {score}</p>
      <button
        onClick={onNextLevel}
        className="mt-[1.5em] bg-sky-500 text-white font-bold py-[0.75em] px-[1.5em] rounded-lg hover:bg-sky-600 transition-colors text-[1.2em]"
      >
        Next Phrase
      </button>
    </div>
  );
};

export default LevelCompleteOverlay;