import { useState, useEffect, useCallback } from 'react';
import Board from './components/Board';
import { isValidMove, makeMove, hasValidMove, initializeBoard, IA, ChooseBestMove } from './logic/logic';
import './App.css';

function App() {
  const [gameMode, setGameMode] = useState(null);
  const [difficulty, setDifficulty] = useState(2);
  const [currentPlayer, setCurrentPlayer] = useState('B');
  const [board, setBoard] = useState(initializeBoard());
  const [scores, setScores] = useState({ B: 2, W: 2 });
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [showOptions, setShowOptions] = useState(true);

  const playAIMove = useCallback(() => {
    setIsThinking(true);
    setMessage('🤔 IA réfléchit...');

    setTimeout(() => {
      const tree = IA(difficulty, board, 'W');

      if (!tree || tree.length === 0) {
        setMessage("L'IA ne peut pas jouer !");
        setCurrentPlayer('B');
        setIsThinking(false);
        return;
      }

      const bestMove = ChooseBestMove(tree, 'W');

      if (bestMove) {
        // ✅ Applique le coup et met à jour le state
        const newBoard = makeMove(board, bestMove[0], bestMove[1], 'W');
        setBoard(newBoard);

        // ✅ Recalcule les scores
        const blackCount = newBoard.flat().filter(cell => cell === 'B').length;
        const whiteCount = newBoard.flat().filter(cell => cell === 'W').length;
        setScores({ B: blackCount, W: whiteCount });

        // ✅ Vérifie la fin de partie
        const nextPlayer = 'B';
        if (!hasValidMove(newBoard, nextPlayer)) {
          if (!hasValidMove(newBoard, 'W')) {
            setGameOver(true);
            const winner = blackCount > whiteCount ? '⚫ Noir' : whiteCount > blackCount ? '⚪ Blanc' : 'Égalité';
            setMessage(winner === 'Égalité' ? "🤝 Égalité parfaite !" : `${winner} a gagné 🎉`);
          } else {
            setMessage("⚫ Noir ne peut pas jouer.");
            setTimeout(() => setMessage(''), 3000);
          }
        } else {
          setCurrentPlayer(nextPlayer);
          setMessage('');
        }
      }

      setIsThinking(false);
    }, 1000);
  }, [board, difficulty]);

  useEffect(() => {
    if (gameMode === 'pve' && currentPlayer === 'W' && !gameOver && !isThinking) {
      playAIMove();
    }
  }, [currentPlayer, gameMode, gameOver, isThinking, playAIMove]);

  const handleCellClick = (r, c) => {
    if (gameOver || isThinking) return;

    // En PVE : seul le joueur noir peut cliquer
    if (gameMode === 'pve' && currentPlayer === 'W') return;

    if (!isValidMove(board, r, c, currentPlayer)) {
      setMessage('❌ Coup invalide !');
      setTimeout(() => setMessage(''), 2000);
      return;
    }

    const newBoard = makeMove(board, r, c, currentPlayer);
    setBoard(newBoard);

    const blackCount = newBoard.flat().filter(cell => cell === 'B').length;
    const whiteCount = newBoard.flat().filter(cell => cell === 'W').length;
    setScores({ B: blackCount, W: whiteCount });

    const nextPlayer = currentPlayer === 'B' ? 'W' : 'B';

    if (!hasValidMove(newBoard, nextPlayer)) {
      if (!hasValidMove(newBoard, currentPlayer)) {
        setGameOver(true);
        const winner = blackCount > whiteCount ? '⚫ Noir' : whiteCount > blackCount ? '⚪ Blanc' : 'Égalité';
        setMessage(winner === 'Égalité' ? "🤝 Égalité parfaite !" : `${winner} a gagné 🎉`);
      } else {
        setMessage(`${nextPlayer === 'B' ? '⚫ Noir' : '⚪ Blanc'} ne peut pas jouer.`);
        setTimeout(() => setMessage(''), 3000);
      }
    } else {
      setCurrentPlayer(nextPlayer);
      setMessage('');
    }
  };

  const resetGame = () => {
    setBoard(initializeBoard());
    setCurrentPlayer('B');
    setScores({ B: 2, W: 2 });
    setGameOver(false);
    setMessage('');
    setIsThinking(false);
  };

  // Menu d'options
  if (showOptions) {
    return (
      <div className="app-container">
        <div className="menu-card">
          <h1 className="game-title">🎮 Othello</h1>
          <p className="menu-subtitle">Choisissez votre mode de jeu</p>

          <div className="option-group">
            <label>Mode :</label>
            <select value={gameMode || ''} onChange={(e) => setGameMode(e.target.value)}>
              <option value="">-- Sélectionner --</option>
              <option value="pvp">👥 Joueur vs Joueur</option>
              <option value="pve">🤖 Joueur vs IA</option>
            </select>
          </div>

          {gameMode === 'pve' && (
            <div className="option-group">
              <label>Difficulté :</label>
              <select value={difficulty} onChange={(e) => setDifficulty(parseInt(e.target.value))}>
                <option value={2}>Facile (2 coup)</option>
                <option value={4}>Moyen (4 coups)</option>
                <option value={7}>Difficile (7 coups)</option>
                <option value={10}>Expert (10 coups)</option>
              </select>
            </div>
          )}

          <button
            className="menu-button pvp"
            disabled={!gameMode}
            onClick={() => {
              resetGame();
              setShowOptions(false);
            }}
          >
            🚀 Lancer la partie
          </button>
        </div>
      </div>
    );
  }

  // Écran de jeu
  return (
    <div className="app-container">
      <div className="game-card">
        <div className="game-header">
          <button onClick={() => setShowOptions(true)} className="back-button">
            ← Menu
          </button>
          <h1 className="game-title">🎮 Othello</h1>
          <div style={{ width: '80px' }}></div>
        </div>

        <div className="mode-indicator">
          {gameMode === 'pvp' ? '👥 Joueur vs Joueur' : '🤖 Joueur vs IA'}
        </div>

        <div className="status-container">
          <div className="player-info">
            <div className="player-name">
              {currentPlayer === 'B' ? '▶ ' : ''} ⚫ Noir
            </div>
            <div className="player-score">{scores.B}</div>
          </div>
          <div className="player-info">
            <div className="player-name">
              {currentPlayer === 'W' ? '▶ ' : ''} ⚪ Blanc
            </div>
            <div className="player-score">{scores.W}</div>
          </div>
        </div>

        {message && (
          <div className={`message ${gameOver ? 'success' : isThinking ? 'info' : 'warning'}`}>
            {message}
          </div>
        )}

        <Board
          board={board}
          onCellClick={handleCellClick}
          currentPlayer={currentPlayer}
        />

        <button onClick={resetGame} className="reset-button">
          🔄 Nouvelle Partie
        </button>
      </div>
    </div>
  );
}

export default App;