import { useState } from "react";
import "./c.css"; 

export default function GameOptionsCard({ onStart, visible, onClose }) {
  const [mode, setMode] = useState("pve");
  const [difficulty, setDifficulty] = useState("easy");

  if (!visible) return null; 

  return (
    <div className="options-overlay">
      <div className="options-card">
        <h2>⚙️ Paramètres de la partie</h2>

        <div className="option-group">
          <h4>Type de partie</h4>
          <label>
            <input
              type="radio"
              name="mode"
              value="pve"
              checked={mode === "pve"}
              onChange={() => setMode("pve")}
            />
            Joueur vs IA
          </label>
          <label>
            <input
              type="radio"
              name="mode"
              value="pvp"
              checked={mode === "pvp"}
              onChange={() => setMode("pvp")}
            />
            Joueur vs Joueur
          </label>
        </div>

        {mode === "pve" && (
          <div className="option-group">
            <h4>Difficulté</h4>
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              <option value="easy">Facile</option>
              <option value="medium">Moyenne</option>
              <option value="hard">Difficile</option>
            </select>
          </div>
        )}

        <div className="option-buttons">
          <button onClick={() => onStart(mode, difficulty)}>🎮 Lancer la partie</button>
          <button className="cancel" onClick={onClose}>❌ Fermer</button>
        </div>
      </div>
    </div>
  );
}
