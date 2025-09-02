
// FIX: Import missing types for CHARACTER_SETS
import { Phrase, GameCharacter, CharacterSetType } from './types';

export const GRID_SIZE = 4;

export const CLASSROOM_PHRASES: Phrase[] = [
  {
    name: 'おはよう',
    romaji: 'ohayou',
    characters: [
      { char: 'お', romaji: 'o' },
      { char: 'は', romaji: 'ha' },
      { char: 'よ', romaji: 'yo' },
      { char: 'う', romaji: 'u' },
    ],
  },
  {
    name: 'こんにちは',
    romaji: 'konnichiwa',
    characters: [
      { char: 'こ', romaji: 'ko' },
      { char: 'ん', romaji: 'n' },
      { char: 'に', romaji: 'ni' },
      { char: 'ち', romaji: 'chi' },
      { char: 'は', romaji: 'ha' },
    ],
  },
  {
    name: 'ありがとう',
    romaji: 'arigatou',
    characters: [
      { char: 'あ', romaji: 'a' },
      { char: 'り', romaji: 'ri' },
      { char: 'が', romaji: 'ga' },
      { char: 'と', romaji: 'to' },
      { char: 'う', romaji: 'u' },
    ],
  },
    {
    name: 'さようなら',
    romaji: 'sayounara',
    characters: [
      { char: 'さ', romaji: 'sa' },
      { char: 'よ', romaji: 'yo' },
      { char: 'う', romaji: 'u' },
      { char: 'な', romaji: 'na' },
      { char: 'ら', romaji: 'ra' },
    ],
  },
  {
    name: 'はじめまして',
    romaji: 'hajimemashite',
    characters: [
      { char: 'は', romaji: 'ha' },
      { char: 'じ', romaji: 'ji' },
      { char: 'め', romaji: 'me' },
      { char: 'ま', romaji: 'ma' },
      { char: 'し', romaji: 'shi' },
      { char: 'て', romaji: 'te' },
    ],
  },
];

// FIX: Add missing CHARACTER_SETS constant for GameSetup component
export const CHARACTER_SETS: {
  [key in CharacterSetType]: { lines: GameCharacter[][] };
} = {
  hiragana: {
    lines: [
      [
        { char: 'あ', romaji: 'a' },
        { char: 'い', romaji: 'i' },
        { char: 'う', romaji: 'u' },
        { char: 'え', romaji: 'e' },
        { char: 'お', romaji: 'o' },
      ],
      [
        { char: 'か', romaji: 'ka' },
        { char: 'き', romaji: 'ki' },
        { char: 'く', romaji: 'ku' },
        { char: 'け', romaji: 'ke' },
        { char: 'こ', romaji: 'ko' },
      ],
      [
        { char: 'さ', romaji: 'sa' },
        { char: 'し', romaji: 'shi' },
        { char: 'す', romaji: 'su' },
        { char: 'せ', romaji: 'se' },
        { char: 'そ', romaji: 'so' },
      ],
    ],
  },
  katakana: {
    lines: [
      [
        { char: 'ア', romaji: 'a' },
        { char: 'イ', romaji: 'i' },
        { char: 'ウ', romaji: 'u' },
        { char: 'エ', romaji: 'e' },
        { char: 'オ', romaji: 'o' },
      ],
      [
        { char: 'カ', romaji: 'ka' },
        { char: 'キ', romaji: 'ki' },
        { char: 'ク', romaji: 'ku' },
        { char: 'ケ', romaji: 'ke' },
        { char: 'コ', romaji: 'ko' },
      ],
      [
        { char: 'サ', romaji: 'sa' },
        { char: 'シ', romaji: 'shi' },
        { char: 'ス', romaji: 'su' },
        { char: 'セ', romaji: 'se' },
        { char: 'ソ', romaji: 'so' },
      ],
    ],
  },
};

export const TILE_COLORS = [
  // Base colors repeat for each line
  'bg-slate-200 text-slate-800',      // a
  'bg-stone-300 text-stone-900',      // i
  'bg-orange-300 text-white',         // u
  'bg-amber-400 text-white',          // e
  'bg-yellow-500 text-white',         // o
  'bg-lime-500 text-white',           // ka
  'bg-green-500 text-white',          // ki
  'bg-emerald-500 text-white',        // ku
  'bg-teal-500 text-white',           // ke
  'bg-cyan-500 text-white',           // ko
  'bg-sky-500 text-white',            // sa
  'bg-blue-600 text-white',           // shi
  'bg-indigo-600 text-white',         // su
  'bg-violet-600 text-white',         // se
  'bg-purple-700 text-white',         // so
  'bg-fuchsia-700 text-white',        // ta
  'bg-pink-700 text-white',           // chi
  'bg-rose-700 text-white',           // tsu
  'bg-red-600 text-white',            // te
  'bg-red-700 text-white',            // to
];

export const getTileAppearance = (level: number) => {
  const colorIndex = level % TILE_COLORS.length;
  return TILE_COLORS[colorIndex];
};
