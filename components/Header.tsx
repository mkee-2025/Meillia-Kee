
import React from 'react';
import { Phrase } from '../types';

interface HeaderProps {
  score: number;
  bestScore: number;
  onNewGame: () => void;
  level: number;
  phrase: Phrase;
}

const ScorePill: React.FC<{ title: string; score: number }> = ({ title, score }) => (
  <div className="bg-slate-300 rounded-lg p-2 sm:p-3 text-center w-24 sm:w-28">
    <div className="text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-wider">{title}</div>
    <div className="text-xl sm:text-2xl font-bold text-slate-900">{score}</div>
  </div>
);

const Header: React.FC<HeaderProps> = ({ score, bestScore, onNewGame, level, phrase }) => {
  return (
    <header className="flex items-start justify-between">
      <div className="flex flex-col">
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-800">Kana</h1>
        <h2 className="text-4xl sm:text-5xl font-bold text-sky-500 -mt-2">2048</h2>
        <div className="mt-2 bg-slate-200 px-3 py-1 rounded-lg text-slate-700">
            <p className="font-bold text-sm sm:text-base">Level {level}: {phrase.name}</p>
            <p className="text-xs sm:text-sm">({phrase.romaji})</p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <div className="flex gap-2">
          <ScorePill title="Score" score={score} />
          <ScorePill title="Best" score={bestScore} />
        </div>
        <div className="flex gap-2">
          <button
            onClick={onNewGame}
            className="bg-sky-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-600 transition-colors"
          >
            New Game
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
