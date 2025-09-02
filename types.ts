
export interface TileData {
  id: number;
  level: number;
  isNew?: boolean;
  isMerged?: boolean;
}

export type Grid = (TileData | null)[][];

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface GameCharacter {
  char: string;
  romaji: string;
}

export interface Phrase {
  name: string;
  romaji: string;
  characters: GameCharacter[];
}

// FIX: Add GameOptions and CharacterSetType for GameSetup component
export interface GameOptions {
  characterSet: CharacterSetType;
  lineIndex: number;
}

export type CharacterSetType = 'katakana' | 'hiragana';
