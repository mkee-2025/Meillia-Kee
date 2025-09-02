import React, { useState, TouchEvent } from 'react';
import { Grid, Direction, GameCharacter } from '../types';
import Tile from './Tile';
import { GRID_SIZE } from '../constants';

interface GameBoardProps {
  grid: Grid;
  onMove: (direction: Direction) => void;
  gameMap: GameCharacter[];
}

const GameBoard: React.FC<GameBoardProps> = ({ grid, onMove, gameMap }) => {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);

  const minSwipeDistance = 50;

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };
  
  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
     setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const dx = touchEnd.x - touchStart.x;
    const dy = touchEnd.y - touchStart.y;

    if (Math.abs(dx) > Math.abs(dy)) { // Horizontal swipe
      if (Math.abs(dx) > minSwipeDistance) {
        onMove(dx > 0 ? 'right' : 'left');
      }
    } else { // Vertical swipe
      if (Math.abs(dy) > minSwipeDistance) {
        onMove(dy > 0 ? 'down' : 'up');
      }
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };

  const cells = Array.from({ length: GRID_SIZE * GRID_SIZE });
  const tiles = grid.flat().filter((tile): tile is NonNullable<typeof tile> => tile !== null);

  return (
    <div
      className="relative bg-slate-300 rounded-lg p-3 sm:p-4 grid grid-cols-4 grid-rows-4 touch-none game-board-grid"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {cells.map((_, index) => (
        <div key={index} className="w-full aspect-square bg-slate-400/50 rounded-md" />
      ))}
      {tiles.map(tile => (
        <Tile key={tile.id} tile={tile} grid={grid} gameMap={gameMap} />
      ))}
    </div>
  );
};

export default GameBoard;