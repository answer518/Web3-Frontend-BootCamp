'use client';

import { useState, useEffect } from 'react';
import Board, { getAIMove } from './Board.jsx';

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

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [winner, setWinner] = useState(null);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  useEffect(() => {
    const calculatedWinner = calculateWinner(currentSquares);
    if (calculatedWinner) {
      setWinner(calculatedWinner);
    } else if (!currentSquares.includes(null)) {
      setWinner('Draw');
    }

    if (!xIsNext && !calculatedWinner && currentSquares.includes(null)) {
      const aiMove = getAIMove(currentSquares);
      if (aiMove !== null) {
        const nextSquares = currentSquares.slice();
        nextSquares[aiMove] = 'O';
        handlePlay(nextSquares);
      }
    }
  }, [currentSquares, xIsNext]);

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function handleRestart() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
    setWinner(null);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    setWinner(null);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
      {winner && (
        <div className="modal">
          <div className="modal-content">
            <h2>{winner === 'Draw' ? "It's a Draw!" : `Winner: ${winner}`}</h2>
            <button onClick={handleRestart}>Restart</button>
          </div>
        </div>
      )}
    </div>
  );
}