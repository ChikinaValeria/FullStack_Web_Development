import { useState } from 'react';
import Square from './Square';
import './Board.css';

function getInitialColors() {
  const colors = [];
  for (let i = 0; i < 64; i++) {
    const row = Math.floor(i / 8);
    const isLight = (row + i) % 2 === 0;
    colors.push(isLight ? 'light' : 'dark');
  }
  return colors;
}

function Board() {
  const [squareColors, setSquareColors] = useState(getInitialColors);

  function handleSquareClick(index) {
    const newColors = [...squareColors];
    newColors[index] = newColors[index] === 'light' ? 'dark' : 'light';
    setSquareColors(newColors);
  }

  function renderSquares() {
    const squares = [];
    for (let i = 0; i < 64; i++) {
      squares.push(
        <Square
          key={i}
          color={squareColors[i]}
          onClick={function() { handleSquareClick(i); }}
        />
      );
    }
    return squares;
  }

  return (
    <div className="board">
      {renderSquares()}
    </div>
  );
}

export default Board;