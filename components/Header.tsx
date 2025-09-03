
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
  <div className="bg-slate-300 rounded-lg p-[0.5em] text-center w-[6em]">
    <div className="text-[0.75em] font-semibold text-slate-600 uppercase tracking-wider">{title}</div>
    <div className="text-[1.5em] font-bold text-slate-900">{score}</div>
  </div>
);

const Header: React.FC<HeaderProps> = ({ score, bestScore, onNewGame, level, phrase }) => {
  return (
    <header className="flex items-start justify-between">
      <div className="flex flex-col">
        <h1 className="text-[3em] font-bold text-slate-800 leading-none">Kana</h1>
        <h2 className="text-[3em] font-bold text-sky-500 -mt-[0.2em] leading-none">2048</h2>
        <div className="mt-[0.5em] bg-slate-200 px-[1em] py-[0.5em] rounded-lg text-slate-700">
            <p className="font-bold text-[1.1em]">Level {level}: {phrase.name}</p>
            <p className="text-[0.9em]">({phrase.romaji})</p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-[0.5em]">
        <div className="flex gap-[0.5em]">
          <ScorePill title="Score" score={score} />
          <ScorePill title="Best" score={bestScore} />
        </div>
        <div className="flex gap-[0.5em]">
          <button
            onClick={onNewGame}
            className="bg-sky-500 text-white font-bold py-[0.75em] px-[1.5em] rounded-lg hover:bg-sky-600 transition-colors text-[1em]"
          >
            New Game
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;