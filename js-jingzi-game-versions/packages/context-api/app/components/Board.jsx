'use client';
import Square from './Square.jsx';
import { useGame } from './GameContext.jsx';

export default function Board() {
  const { xIsNext, currentSquares, handlePlay } = useGame();

  function handleClick(i) {
    if (calculateWinner(currentSquares) || currentSquares[i]) {
      return;
    }
    const nextSquares = currentSquares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    handlePlay(nextSquares);
  }

  const winner = calculateWinner(currentSquares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={currentSquares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={currentSquares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={currentSquares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={currentSquares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={currentSquares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={currentSquares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={currentSquares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={currentSquares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={currentSquares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export function getAIMove(squares) {
  // Check if AI can win
  for (let i = 0; i < 9; i++) {
    if (!squares[i]) {
      const nextSquares = squares.slice();
      nextSquares[i] = 'O';
      if (calculateWinner(nextSquares) === 'O') {
        return i;
      }
    }
  }

  // Check if player can win and block
  for (let i = 0; i < 9; i++) {
    if (!squares[i]) {
      const nextSquares = squares.slice();
      nextSquares[i] = 'X';
      if (calculateWinner(nextSquares) === 'X') {
        return i;
      }
    }
  }

  // Otherwise, pick a random available square
  const availableSquares = [];
  for (let i = 0; i < 9; i++) {
    if (!squares[i]) {
      availableSquares.push(i);
    }
  }

  if (availableSquares.length > 0) {
    return availableSquares[Math.floor(Math.random() * availableSquares.length)];
  }

  return null;
}