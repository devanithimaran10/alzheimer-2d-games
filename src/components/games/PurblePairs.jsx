import React, { useState, useEffect, useCallback, useRef } from "react";
import GameLayout from "./GameLayout";
import { useCognitiveScore } from "../../contexts/CognitiveScoreContext";
import "./PurblePairs.css";

// Icons for the pairs - using emojis for simplicity (moved outside to prevent re-renders)
const ICONS = [
  "❤️",
  "😊",
  "🍬",
  "⭐",
  "🎈",
  "🎁",
  "🎵",
  "🌈",
  "🦋",
  "🌺",
  "🍰",
  "🎪",
];

const PurblePairs = () => {
  const { updateGameScore } = useCognitiveScore();

  const [level, setLevel] = useState(1); // 1 = Easy (4x4), 2 = Medium (4x4), 3 = Hard (6x6)
  const [tiles, setTiles] = useState([]);
  const [flippedTiles, setFlippedTiles] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  const getGridSize = () => {
    if (level === 1) return { rows: 4, cols: 4, pairs: 8 }; // Easy: 4x4 = 16 tiles = 8 pairs
    if (level === 2) return { rows: 4, cols: 4, pairs: 8 }; // Medium: same grid, different icons
    return { rows: 6, cols: 6, pairs: 18 }; // Hard: 6x6 = 36 tiles = 18 pairs
  };

  const initializeGame = useCallback(() => {
    const { pairs } = getGridSize();
    const selectedIcons = ICONS.slice(0, pairs);
    const iconPairs = [...selectedIcons, ...selectedIcons];

    // Shuffle the tiles
    const shuffled = iconPairs.sort(() => Math.random() - 0.5);

    const newTiles = shuffled.map((icon, index) => ({
      id: index,
      icon,
      isFlipped: false,
      isMatched: false,
    }));

    setTiles(newTiles);
    setFlippedTiles([]);
    setMatchedPairs([]);
    setMoves(0);
    setMatches(0);
    setGameComplete(false);
  }, [level]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const handleTileClick = (tileId) => {
    if (isProcessing || gameComplete) return;

    const tile = tiles.find((t) => t.id === tileId);
    if (!tile || tile.isFlipped || tile.isMatched) return;
    if (flippedTiles.length >= 2) return;

    // Flip the tile - first add flipping class, then flip
    const newFlippedTiles = [...flippedTiles, tileId];
    setFlippedTiles(newFlippedTiles);

    // Get the DOM element and add flipping class first
    const tileElement = document.querySelector(`[data-tile-id="${tileId}"]`);
    if (tileElement) {
      tileElement.classList.add("flipping");
      // Force reflow
      tileElement.offsetHeight;

      // Now update state to trigger flip
      requestAnimationFrame(() => {
        setTiles((prevTiles) =>
          prevTiles.map((t) =>
            t.id === tileId ? { ...t, isFlipped: true } : t
          )
        );
      });
    } else {
      // Fallback if element not found
      setTiles((prevTiles) =>
        prevTiles.map((t) => (t.id === tileId ? { ...t, isFlipped: true } : t))
      );
    }

    // If two tiles are flipped, check for match
    if (newFlippedTiles.length === 2) {
      setIsProcessing(true);

      const [firstId, secondId] = newFlippedTiles;
      const firstTile = tiles.find((t) => t.id === firstId);
      const secondTile = tiles.find((t) => t.id === secondId);

      setMoves((prev) => {
        const newMoves = prev + 1;

        if (firstTile.icon === secondTile.icon) {
          // Match found!
          setTimeout(() => {
            const { pairs } = getGridSize();
            setTiles((prevTiles) =>
              prevTiles.map((t) =>
                t.id === firstId || t.id === secondId
                  ? { ...t, isMatched: true, isFlipped: false }
                  : t
              )
            );
            setMatchedPairs((prev) => [...prev, firstTile.icon]);
            setMatches((prev) => {
              const newMatches = prev + 1;

              // Check if game is complete
              if (newMatches === pairs) {
                setGameComplete(true);
                // Calculate accuracy: ideal moves would be equal to pairs (one move per pair)
                // Higher accuracy = fewer moves relative to pairs
                const idealMoves = pairs;
                const accuracy = Math.min(1.0, idealMoves / newMoves);
                updateGameScore("musicalTimeTravel", accuracy);
              }

              return newMatches;
            });
            setFlippedTiles([]);
            setIsProcessing(false);
          }, 500);
        } else {
          // No match - flip back
          setTimeout(() => {
            setTiles((prevTiles) =>
              prevTiles.map((t) =>
                t.id === firstId || t.id === secondId
                  ? { ...t, isFlipped: false }
                  : t
              )
            );
            setFlippedTiles([]);
            setIsProcessing(false);
          }, 1000);
        }

        return newMoves;
      });
    }
  };

  const { rows, cols } = getGridSize();
  const gridStyle = {
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gridTemplateRows: `repeat(${rows}, 1fr)`,
  };

  return (
    <GameLayout title="Purble Pairs">
      <div className="purble-pairs">
        <div className="level-selector">
          <button
            className={`level-btn ${level === 1 ? "active" : ""}`}
            onClick={() => setLevel(1)}
          >
            Easy (4x4)
          </button>
          <button
            className={`level-btn ${level === 2 ? "active" : ""}`}
            onClick={() => setLevel(2)}
          >
            Medium (4x4)
          </button>
          <button
            className={`level-btn ${level === 3 ? "active" : ""}`}
            onClick={() => setLevel(3)}
          >
            Hard (6x6)
          </button>
        </div>

        <div className="game-stats">
          <div className="stat-item">
            <span className="stat-label">Moves:</span>
            <span className="stat-value">{moves}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Matches:</span>
            <span className="stat-value">
              {matches} / {getGridSize().pairs}
            </span>
          </div>
        </div>

        <div className="instructions">
          <p>Click tiles to flip them and find matching pairs!</p>
        </div>

        <div className="tiles-grid" style={gridStyle}>
          {tiles.map((tile) => (
            <button
              key={tile.id}
              data-tile-id={tile.id}
              className={`tile ${tile.isFlipped ? "flipped" : ""} ${
                tile.isMatched ? "matched" : ""
              } ${flippedTiles.includes(tile.id) ? "selected" : ""}`}
              onClick={() => handleTileClick(tile.id)}
              onTouchStart={(e) => {
                e.preventDefault();
                handleTileClick(tile.id);
              }}
              disabled={isProcessing || tile.isMatched}
            >
              <div className="tile-front">🍀</div>
              <div className="tile-back">{tile.icon}</div>
            </button>
          ))}
        </div>

        {gameComplete && (
          <div className="completion-message">
            <h2>🎉 Congratulations! You completed the game!</h2>
            <p>
              You found all {getGridSize().pairs} pairs in {moves} moves!
            </p>
            <button className="play-again-button" onClick={initializeGame}>
              Play Again
            </button>
          </div>
        )}

        <button className="reset-button" onClick={initializeGame}>
          Reset Game
        </button>
      </div>
    </GameLayout>
  );
};

export default PurblePairs;
