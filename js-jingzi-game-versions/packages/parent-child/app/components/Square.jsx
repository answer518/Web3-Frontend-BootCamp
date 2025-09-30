'use client';

export default function Square({ value, onSquareClick }) {
  const className = `square ${value ? (value === 'X' ? 'x' : 'o') : ''}`;
  return (
    <button className={className} onClick={onSquareClick}>
      {value}
    </button>
  );
}