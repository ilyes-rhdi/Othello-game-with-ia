
// NOTE: nécessite un bundler qui supporte { type: 'module' } sur les workers (Vite/CRA/Next App Router)
import { IA, ChooseBestMove } from './logic/logic';

let aborted = false;

self.onmessage = async (e) => {
  const { type, board, difficulty, color = 'W' } = e.data || {};
  if (type === 'START') {
    aborted = false;
    try {
      const tree = await IA(difficulty, board, color); // ← TON IA
      if (aborted) return;

      if (!tree || tree.length === 0) {
        self.postMessage({ type: 'BEST_MOVE', bestMove: null });
      } else {
        const bestMove = ChooseBestMove(tree, color); // ← TON choix de coup
        self.postMessage({ type: 'BEST_MOVE', bestMove }); // bestMove = [row, col]
      }
    } catch (err) {
      self.postMessage({ type: 'ERROR', error: String(err?.message || err) });
    } finally {
      self.postMessage({ type: 'DONE' });
    }
  } else if (type === 'ABORT') {
    aborted = true;
  }
};
