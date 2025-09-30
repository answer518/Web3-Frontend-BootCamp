"use client";
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Board from './Board.jsx';
import { jumpTo } from '../store/gameSlice';

export default function Game() {
  const { history, currentMove } = useSelector((state) => state.game);
  const dispatch = useDispatch();
  const [winner, setWinner] = useState(null);
  const currentSquares = history[currentMove];

  useEffect(() => {
    const newWinner = calculateWinner(currentSquares);
    if (newWinner) {
      setWinner(newWinner);
    } else if (history.length === 10 && currentMove === 9) {
      setWinner('draw');
    }
  }, [currentSquares, history, currentMove]);

  function handleRestart() {
    dispatch(jumpTo(0));
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
        <button onClick={() => dispatch(jumpTo(move))}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
      {winner && (
        <div className="modal">
          <div className="modal-content">
            <h2>{winner === 'draw' ? "It's a Draw!" : `Winner: ${winner}`}</h2>
            <button onClick={handleRestart}>Restart</button>
          </div>
        </div>
      )}
    </div>
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