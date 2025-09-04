import { useState, useEffect, useCallback } from 'react';
import { Grid, TileData, Direction, GameCharacter } from '../types';
import { GRID_SIZE, CLASSROOM_PHRASES } from '../constants';

let tileIdCounter = 1;

const createEmptyGrid = (): Grid => Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null));

const getRandomEmptyCell = (grid: Grid): { r: number; c: number } | null => {
  const emptyCells = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === null) {
        emptyCells.push({ r, c });
      }
    }
  }
  if (emptyCells.length === 0) return null;
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
};

const addRandomTile = (grid: Grid, levelIndex: number): Grid => {
  const newGrid = grid.map(row => [...row]);
  const cell = getRandomEmptyCell(newGrid);
  if (cell) {
    const currentPhrase = CLASSROOM_PHRASES[levelIndex];
    // If the phrase only has one character, we can only spawn that one.
    if (currentPhrase.characters.length < 2) {
      newGrid[cell.r][cell.c] = { id: tileIdCounter++, level: 0, isNew: true };
      return newGrid;
    }

    // Dynamically adjust spawn rates based on existing tiles to improve game flow.
    let level0Count = 0;
    let level1Count = 0;
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        const tile = grid[r][c];
        if (tile) {
          if (tile.level === 0) level0Count++;
          else if (tile.level === 1) level1Count++;
        }
      }
    }

    // Default probability is 50/50 for level 0 and 1 tiles.
    // If the board becomes unbalanced, skew the probability to help the player.
    // e.g., if there are many more 'o' tiles than 'ha' tiles, increase the chance of 'ha' spawning.
    let probOfSpawningLevel1 = 0.5;
    if (level0Count > level1Count + 1) {
      // Significantly more level 0 tiles, so we need more level 1 tiles.
      probOfSpawningLevel1 = 0.75; 
    } else if (level1Count > level0Count + 1) {
      // Significantly more level 1 tiles, so we need more level 0 tiles.
      probOfSpawningLevel1 = 0.25;
    }

    const level = Math.random() < probOfSpawningLevel1 ? 1 : 0;
    
    newGrid[cell.r][cell.c] = { id: tileIdCounter++, level, isNew: true };
  }
  return newGrid;
};


const areGridsEqual = (gridA: Grid, gridB: Grid): boolean => {
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (gridA[r][c]?.id !== gridB[r][c]?.id || gridA[r][c]?.level !== gridB[r][c]?.level) {
        return false;
      }
    }
  }
  return true;
};

const moveAndMerge = (line: (TileData | null)[], phraseLength: number): { newLine: (TileData | null)[]; points: number; phrasesCompleted: number } => {
  const filtered = line.filter(Boolean) as TileData[];
  const newLine: (TileData | null)[] = [];
  let points = 0;
  let phrasesCompleted = 0;
  let i = 0;
  while (i < filtered.length) {
    if (i + 1 < filtered.length) {
      const level1 = filtered[i].level;
      const level2 = filtered[i + 1].level;

      // Check for sequential merge, e.g., 'o' (0) and 'ha' (1)
      if (Math.abs(level1 - level2) === 1) {
        const newLevel = Math.max(level1, level2) + 1;

        if (newLevel >= phraseLength) {
          phrasesCompleted++;
          points += Math.pow(2, phraseLength);
        } else {
          newLine.push({ id: tileIdCounter++, level: newLevel, isMerged: true });
          points += Math.pow(2, newLevel);
        }
        i += 2; // Skip both merged tiles
        continue;
      }
    }
    
    // If no merge, push the current tile and move to the next one
    newLine.push(filtered[i]);
    i++;
  }
  while (newLine.length < GRID_SIZE) {
    newLine.push(null);
  }
  return { newLine, points, phrasesCompleted };
};

const transposeGrid = (grid: Grid): Grid => {
  const newGrid = createEmptyGrid();
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      newGrid[c][r] = grid[r][c];
    }
  }
  return newGrid;
};

const canMove = (grid: Grid): boolean => {
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === null) return true; // Empty cell exists
      const currentLevel = grid[r][c]?.level;
      if (currentLevel !== undefined) {
        // Check for horizontal merge possibility
        if (c + 1 < GRID_SIZE && grid[r][c+1] !== null) {
          if (Math.abs(grid[r][c+1]!.level - currentLevel) === 1) {
            return true;
          }
        }
        // Check for vertical merge possibility
        if (r + 1 < GRID_SIZE && grid[r+1][c] !== null) {
           if (Math.abs(grid[r+1][c]!.level - currentLevel) === 1) {
            return true;
          }
        }
      }
    }
  }
  return false;
};

export const useGameLogic = (levelIndex: number) => {
  const [grid, setGrid] = useState<Grid>(createEmptyGrid());
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => Number(localStorage.getItem('bestScore') || 0));
  const [isGameOver, setIsGameOver] = useState(false);
  const [isLevelWon, setIsLevelWon] = useState(false);
  const [gameMap, setGameMap] = useState<GameCharacter[] | null>(null);
  const [phrasesCompleted, setPhrasesCompleted] = useState(0);

  const resetGame = useCallback(() => {
    tileIdCounter = 1;
    let newGrid = createEmptyGrid();
    newGrid = addRandomTile(newGrid, levelIndex);
    newGrid = addRandomTile(newGrid, levelIndex);
    setGrid(newGrid);
    setScore(0);
    setPhrasesCompleted(0);
    setIsGameOver(false);
    setIsLevelWon(false);
  }, [levelIndex]);

  useEffect(() => {
    setGameMap(CLASSROOM_PHRASES[levelIndex].characters);
    resetGame();
  }, [levelIndex, resetGame]);

  const move = useCallback((direction: Direction) => {
    if (isGameOver || isLevelWon) return;

    let currentGrid: Grid = grid.map(row => row.map(tile => tile ? { ...tile, isNew: false, isMerged: false } : null));
    let newGrid = createEmptyGrid();
    let moved = false;
    let points = 0;
    let phrasesCompletedThisMove = 0;

    const phraseLength = CLASSROOM_PHRASES[levelIndex].characters.length;

    if (direction === 'left' || direction === 'right') {
      for (let r = 0; r < GRID_SIZE; r++) {
        const line = currentGrid[r];
        const orderedLine = direction === 'left' ? line : [...line].reverse();
        const { newLine, points: p, phrasesCompleted: f } = moveAndMerge(orderedLine, phraseLength);
        newGrid[r] = direction === 'left' ? newLine : newLine.reverse();
        points += p;
        phrasesCompletedThisMove += f;
      }
    } else { // 'up' or 'down'
      currentGrid = transposeGrid(currentGrid);
      for (let r = 0; r < GRID_SIZE; r++) {
        const line = currentGrid[r];
        const orderedLine = direction === 'up' ? line : [...line].reverse();
        const { newLine, points: p, phrasesCompleted: f } = moveAndMerge(orderedLine, phraseLength);
        newGrid[r] = direction === 'up' ? newLine : newLine.reverse();
        points += p;
        phrasesCompletedThisMove += f;
      }
      newGrid = transposeGrid(newGrid);
    }

    moved = !areGridsEqual(grid, newGrid);

    if (moved) {
      const gridWithNewTile = addRandomTile(newGrid, levelIndex);
      const newScore = score + points;
      const newPhrasesCompleted = phrasesCompleted + phrasesCompletedThisMove;

      setScore(newScore);
      setPhrasesCompleted(newPhrasesCompleted);

      if (newScore > bestScore) {
        setBestScore(newScore);
        localStorage.setItem('bestScore', String(newScore));
      }

      if (newPhrasesCompleted >= 5) {
        setIsLevelWon(true);
      } else if (!canMove(gridWithNewTile)) {
        setIsGameOver(true);
      }
      
      setGrid(gridWithNewTile);
    }
  }, [grid, score, bestScore, isGameOver, isLevelWon, levelIndex, phrasesCompleted]);

  return { grid, score, bestScore, isGameOver, isLevelWon, move, resetGame, gameMap, phrasesCompleted };
};