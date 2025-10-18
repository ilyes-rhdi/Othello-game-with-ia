// =========================
// 🧠 LOGIQUE DU JEU OTHELLO
// =========================

// Dimensions du plateau
export const BOARD_SIZE = 8;

// 1. Crée un plateau initial avec 4 pions au centre
export function initializeBoard() {
  const board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
  board[3][3] = 'W';
  board[3][4] = 'B';
  board[4][3] = 'B';
  board[4][4] = 'W';
  return board
  // retourne un tableau 2D 8x8 avec les pions initiaux
}
function peutCapturer(board, x, y, couleurJoueur) {
  const directions = [
    [1, 0],  [-1, 0],   // vertical
    [0, 1],  [0, -1],   // horizontal
    [1, 1],  [1, -1],   // diagonales
    [-1, 1], [-1, -1]
  ];
  let tousLesPionsARetourner = []; 
  for (let [dx, dy] of directions) {
    let i = x + dx;
    let j = y + dy;
    let aVuEnnemi = false;
    let pionaretourner = [];
    while (i >= 0 && i < 8 && j >= 0 && j < 8) {
      const pion = board[i][j];


      if (pion === null) break; // case vide
      if (pion !== couleurJoueur) {
        aVuEnnemi = true;
        pionaretourner.push([i, j]);
      } else {
        if (aVuEnnemi) tousLesPionsARetourner.push(...pionaretourner); // ennemi(s) + allié => capture possible
        break;
      }

      i += dx;
      j += dy;
    }
  }

  return [tousLesPionsARetourner.length > 0, tousLesPionsARetourner];
}

export function isValidMove(board, row, col, player) {
  if (board[row][col] !== null) return false; // case déjà occupée
  let [i,_] = peutCapturer(board, row, col, player);
  return i;
}

function getFlippableDiscs(board, row, col, player) {

  let [_,j] = peutCapturer(board, row, col, player);
  return j;

}

export function makeMove(board, row, col, player) {
  const newBoard = board.map(r => r.slice());
  newBoard[row][col] = player;
  const discsToFlip = getFlippableDiscs(board, row, col, player);
  for (let [x, y] of discsToFlip) {
    newBoard[x][y] = player;
  }
  return newBoard;
}


export function hasValidMove(board, player)
{
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (isValidMove(board, r, c, player)) {
        return true;
      }
    }    
  }
  return false;
}

export function getScore(board) {
  let blackCount = 0;
  let whiteCount = 0; 
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] === 'B') blackCount++;
      else if (board[r][c] === 'W') whiteCount++;
    }
  }
  return { black: blackCount, white: whiteCount };

}

export function isGameOver(board) {
  return !hasValidMove(board, 'B') && !hasValidMove(board, 'W');
  // aucun des deux joueurs ne peut jouer
}
function countValidMoves(board, player) {
  let movements = [];
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (isValidMove(board, row, col, player)) {
        movements.push([row, col]);
      }
    }
  }

  return movements;
}
export function copyBoard(board) {
  return board.map(row => row.slice());
}

export function IA (np,board,player) { 
  let nodes = [];
  if (np <= 0) return null;
    for (let move of countValidMoves(board, player)) {
      let newBoard = makeMove(copyBoard(board),move[0],move[1],player);
      nodes.push({
            board: newBoard,
            score: getScore(newBoard),
            move: move,
            children: IA(np-1,newBoard,player === 'B' ? 'W' : 'B') // générer enfants pour np>1
    });
    }
  return nodes;  
}
function minMax(node, isMaximizingPlayer, iaColor) {
  // Si pas d'enfants, retourne le score du nœud
  if (!node.children || node.children.length === 0) {
    // Score adapté selon la couleur de l'IA
    return iaColor === 'B' 
      ? node.score.black - node.score.white   // IA noire
      : node.score.white - node.score.black;  // IA blanche
  }

  if (isMaximizingPlayer) {
    let maxEval = -Infinity;
    for (let child of node.children) {
      let evalScore = minMax(child, false, iaColor); // ✅ Passe iaColor
      maxEval = Math.max(maxEval, evalScore);
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (let child of node.children) {
      let evalScore = minMax(child, true, iaColor); // ✅ Passe iaColor
      minEval = Math.min(minEval, evalScore);
    }
    return minEval;
  }
}
export  function ChooseBestMove(nodes, iaColor) {
  let bestScore = -Infinity;
  let bestMove = null;

  for (let node of nodes) {
    let score = minMax(node, true,iaColor); // l’IA joue en premier
    if (score > bestScore) {
      bestScore = score;
      bestMove = node.move;
    }
  }

  return bestMove; // [row, col] du meilleur coup
}
