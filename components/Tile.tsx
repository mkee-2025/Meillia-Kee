import React, { useState, useEffect } from 'react';
import { TileData, Grid, GameCharacter } from '../types';
import { getTileAppearance } from '../constants';

interface TileProps {
  tile: TileData;
  grid: Grid;
  gameMap: GameCharacter[];
}

const findTilePosition = (grid: Grid, tileId: number): { row: number, col: number } | null => {
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c]?.id === tileId) {
        return { row: r, col: c };
      }
    }
  }
  return null;
};

const Tile: React.FC<TileProps> = ({ tile, grid, gameMap }) => {
  const [scale, setScale] = useState(tile.isNew ? 0 : 1);
  
  const position = findTilePosition(grid, tile.id);
  const { char, romaji } = gameMap[tile.level] || { char: '？', romaji: '??' };
  const appearance = getTileAppearance(tile.level);

  useEffect(() => {
    if (tile.isNew || tile.isMerged) {
      setScale(0);
      requestAnimationFrame(() => {
        setScale(tile.isMerged ? 1.2 : 1);
        if(tile.isMerged) {
            setTimeout(() => setScale(1), 100);
        }
      });
    }
  }, [tile.isNew, tile.isMerged, tile.id]);

  if (!position) return null;

  const top = `calc(${position.row * 100}% + ${position.row} * var(--grid-gap))`;
  const left = `calc(${position.col * 100}% + ${position.col} * var(--grid-gap))`;
  
  const style = {
    transform: `translate(${left}, ${top}) scale(${scale})`,
  };

  return (
    <div
      className={`absolute w-1/4 h-1/4 p-1 transition-transform duration-200 ease-in-out`}
      style={style}
    >
      <div className={`w-full h-full rounded-md flex flex-col items-center justify-center font-bold select-none ${appearance}`}>
        <span className="text-3xl sm:text-4xl">{char}</span>
        <span className="text-sm sm:text-base">{romaji}</span>
      </div>
    </div>
  );
};

export default Tile;