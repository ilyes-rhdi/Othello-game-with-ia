 function Cell({ value, onClick, isValidMove }) {
  return (
    <div 
      className={`cell ${isValidMove ? 'valid-move' : ''}`}
      onClick={onClick}
    >
      {value === 'B' && <div className="piece black"></div>}
      {value === 'W' && <div className="piece white"></div>}
      {isValidMove && <div className="hint"></div>}
    </div>
  );
}

export default Cell;