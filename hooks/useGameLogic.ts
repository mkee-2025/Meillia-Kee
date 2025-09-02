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
    // Add one of the first two characters of the phrase, ensuring we don't go out of bounds.
    const offset = Math.random() < 0.9 ? 0 : (currentPhrase.characters.length > 1 ? 1 : 0);
    const level = offset; // level is the index in the phrase's character array
    
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

const moveAndMerge = (line: (TileData | null)[], maxLevel: number): { newLine: (TileData | null)[]; points: number; finalTilesCreated: number } => {
  const filtered = line.filter(Boolean) as TileData[];
  const newLine: (TileData | null)[] = [];
  let points = 0;
  let finalTilesCreated = 0;
  let i = 0;
  while (i < filtered.length) {
    const currentLevel = filtered[i].level;
    if (i + 1 < filtered.length && currentLevel === filtered[i + 1].level) {
      if (currentLevel === maxLevel) {
        // Final tiles merge and disappear, giving a score bonus
        points += Math.pow(2, currentLevel + 2);
      } else {
        const newLevel = currentLevel + 1;
        if (newLevel === maxLevel) {
          finalTilesCreated++;
        }
        newLine.push({ id: tileIdCounter++, level: newLevel, isMerged: true });
        points += Math.pow(2, newLevel + 1);
      }
      i += 2; // Skip both merged tiles
    } else {
      newLine.push(filtered[i]);
      i++;
    }
  }
  while (newLine.length < GRID_SIZE) {
    newLine.push(null);
  }
  return { newLine, points, finalTilesCreated };
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

const canMove = (grid: Grid, maxLevel: number): boolean => {
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === null) return true; // Empty cell exists
      const currentLevel = grid[r][c]?.level;
      if (currentLevel !== undefined) {
          // A move is possible if a merge can happen
          if (r + 1 < GRID_SIZE && currentLevel === grid[r+1][c]?.level) return true;
          if (c + 1 < GRID_SIZE && currentLevel === grid[r][c+1]?.level) return true;
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
  const [finalTilesCollected, setFinalTilesCollected] = useState(0);

  const resetGame = useCallback(() => {
    tileIdCounter = 1;
    let newGrid = createEmptyGrid();
    newGrid = addRandomTile(newGrid, levelIndex);
    newGrid = addRandomTile(newGrid, levelIndex);
    setGrid(newGrid);
    setScore(0);
    setFinalTilesCollected(0);
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
    let finalTilesThisMove = 0;

    const maxLevel = CLASSROOM_PHRASES[levelIndex].characters.length - 1;

    if (direction === 'left' || direction === 'right') {
      for (let r = 0; r < GRID_SIZE; r++) {
        const line = currentGrid[r];
        const orderedLine = direction === 'left' ? line : [...line].reverse();
        const { newLine, points: p, finalTilesCreated: f } = moveAndMerge(orderedLine, maxLevel);
        newGrid[r] = direction === 'left' ? newLine : newLine.reverse();
        points += p;
        finalTilesThisMove += f;
      }
    } else { // 'up' or 'down'
      currentGrid = transposeGrid(currentGrid);
      for (let r = 0; r < GRID_SIZE; r++) {
        const line = currentGrid[r];
        const orderedLine = direction === 'up' ? line : [...line].reverse();
        const { newLine, points: p, finalTilesCreated: f } = moveAndMerge(orderedLine, maxLevel);
        newGrid[r] = direction === 'up' ? newLine : newLine.reverse();
        points += p;
        finalTilesThisMove += f;
      }
      newGrid = transposeGrid(newGrid);
    }

    moved = !areGridsEqual(grid, newGrid);

    if (moved) {
      const gridWithNewTile = addRandomTile(newGrid, levelIndex);
      const newScore = score + points;
      const newFinalTilesCollected = finalTilesCollected + finalTilesThisMove;

      setScore(newScore);
      setFinalTilesCollected(newFinalTilesCollected);

      if (newScore > bestScore) {
        setBestScore(newScore);
        localStorage.setItem('bestScore', String(newScore));
      }

      if (newFinalTilesCollected >= 5) {
        setIsLevelWon(true);
      } else if (!canMove(gridWithNewTile, maxLevel)) {
        setIsGameOver(true);
      }
      
      setGrid(gridWithNewTile);
    }
  }, [grid, score, bestScore, isGameOver, isLevelWon, levelIndex, finalTilesCollected]);

  return { grid, score, bestScore, isGameOver, isLevelWon, move, resetGame, gameMap, finalTilesCollected };
};