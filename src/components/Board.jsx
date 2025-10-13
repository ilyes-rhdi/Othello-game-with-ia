import Cell from './Cell';
import { isValidMove } from '../logic/logic';

function Board({ board, onCellClick, currentPlayer }) {
  return (
    <div className="board">
      {board.map((row, r) => (
        <div key={r} className="board-row">
          {row.map((cell, c) => (
            <Cell
              key={`${r}-${c}`}
              value={cell}
              onClick={() => onCellClick(r, c)}
              isValidMove={cell === null && isValidMove(board, r, c, currentPlayer)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Board;



