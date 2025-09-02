import React, { useState } from 'react';
import { GameOptions, CharacterSetType } from '../types';
import { CHARACTER_SETS } from '../constants';

interface GameSetupProps {
  onStart: (options: GameOptions) => void;
}

const GameSetup: React.FC<GameSetupProps> = ({ onStart }) => {
  const [characterSet, setCharacterSet] = useState<CharacterSetType>('katakana');
  const [lineIndex, setLineIndex] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart({ characterSet, lineIndex });
  };

  const selectedSet = CHARACTER_SETS[characterSet];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 font-sans bg-slate-50">
      <div className="w-full max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
        <div className="text-center mb-6">
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-800">Kana</h1>
            <h2 className="text-4xl sm:text-5xl font-bold text-sky-500 -mt-2">2048</h2>
            <p className="text-slate-500 mt-2">Game Setup</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-slate-700 text-base font-bold mb-2">
              Character Set
            </label>
            <div className="flex rounded-md shadow-sm">
              <button
                type="button"
                onClick={() => { setCharacterSet('katakana'); setLineIndex(0); }}
                className={`flex-1 py-2 px-3 rounded-l-md transition-colors text-base font-semibold ${characterSet === 'katakana' ? 'bg-sky-500 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
              >
                Katakana
              </button>
              <button
                type="button"
                onClick={() => { setCharacterSet('hiragana'); setLineIndex(0); }}
                className={`flex-1 py-2 px-3 rounded-r-md transition-colors text-base font-semibold ${characterSet === 'hiragana' ? 'bg-sky-500 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
              >
                Hiragana
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="line-select" className="block text-slate-700 text-base font-bold mb-2">
              Starting Line
            </label>
            <div className="relative">
              <select
                id="line-select"
                value={lineIndex}
                onChange={(e) => setLineIndex(Number(e.target.value))}
                className="block w-full appearance-none bg-white border border-slate-300 text-slate-700 py-2 px-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-sky-500 text-base"
              >
                {selectedSet.lines.map((line, index) => (
                  <option key={index} value={index}>
                    {line.map(c => c.char).join(', ')} ({line.map(c => c.romaji).join(', ')})
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-sky-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-600 transition-colors text-lg"
          >
            Start Game
          </button>
        </form>
      </div>
    </div>
  );
};

export default GameSetup;