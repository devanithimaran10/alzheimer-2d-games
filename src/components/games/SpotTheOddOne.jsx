import React, { useState, useEffect } from "react";
import GameLayout from "./GameLayout";
import "./SpotTheOddOne.css";

const SpotTheOddOne = () => {
  const puzzles = [
    {
      items: [
        { type: "dog", emoji: "🐕", name: "Dog" },
        { type: "dog", emoji: "🐕", name: "Dog" },
        { type: "dog", emoji: "🐕", name: "Dog" },
        { type: "toaster", emoji: "🍞", name: "Toaster" },
      ],
      oddIndex: 3,
    },
    {
      items: [
        { type: "fruit", emoji: "🍎", name: "Apple" },
        { type: "fruit", emoji: "🍌", name: "Banana" },
        { type: "fruit", emoji: "🍊", name: "Orange" },
        { type: "tool", emoji: "🔨", name: "Hammer" },
      ],
      oddIndex: 3,
    },
    {
      items: [
        { type: "vehicle", emoji: "🚗", name: "Car" },
        { type: "vehicle", emoji: "🚗", name: "Car" },
        { type: "vehicle", emoji: "🚗", name: "Car" },
        { type: "animal", emoji: "🐱", name: "Cat" },
      ],
      oddIndex: 3,
    },
    {
      items: [
        { type: "clothing", emoji: "👕", name: "Shirt" },
        { type: "clothing", emoji: "👖", name: "Pants" },
        { type: "clothing", emoji: "👕", name: "Shirt" },
        { type: "food", emoji: "🍕", name: "Pizza" },
      ],
      oddIndex: 3,
    },
    {
      items: [
        { type: "color", emoji: "🔴", name: "Red" },
        { type: "color", emoji: "🔴", name: "Red" },
        { type: "color", emoji: "🔴", name: "Red" },
        { type: "shape", emoji: "⭐", name: "Star" },
      ],
      oddIndex: 3,
    },
  ];

  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [shuffledItems, setShuffledItems] = useState([]);

  useEffect(() => {
    const items = [...puzzles[currentPuzzle].items];
    setShuffledItems(items.sort(() => Math.random() - 0.5));
    setSelectedIndex(null);
    setShowResult(false);
  }, [currentPuzzle]);

  const handleItemClick = (index) => {
    if (showResult) return;

    const originalIndex = puzzles[currentPuzzle].items.findIndex(
      (item) =>
        item.emoji === shuffledItems[index].emoji &&
        item.name === shuffledItems[index].name
    );
    const isCorrect = originalIndex === puzzles[currentPuzzle].oddIndex;

    setSelectedIndex(index);
    setShowResult(true);

    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const nextPuzzle = () => {
    setCurrentPuzzle((prev) => (prev + 1) % puzzles.length);
  };

  const reset = () => {
    setCurrentPuzzle(0);
    setScore(0);
    setSelectedIndex(null);
    setShowResult(false);
  };

  const currentPuzzleData = puzzles[currentPuzzle];
  const selectedItem =
    selectedIndex !== null ? shuffledItems[selectedIndex] : null;
  const isCorrect =
    selectedItem &&
    puzzles[currentPuzzle].items.findIndex(
      (item) =>
        item.emoji === selectedItem.emoji && item.name === selectedItem.name
    ) === currentPuzzleData.oddIndex;

  return (
    <GameLayout title="Spot the Odd One">
      <div className="spot-the-odd-one">
        <div className="score-display">
          <p>
            Score: {score} / {puzzles.length}
          </p>
        </div>

        <div className="instructions">
          <p>Find the item that is different from the others</p>
        </div>

        <div className="puzzle-container">
          <div className="items-grid">
            {shuffledItems.map((item, index) => {
              let className = "item-card";
              if (showResult) {
                const originalIndex = puzzles[currentPuzzle].items.findIndex(
                  (i) => i.emoji === item.emoji && i.name === item.name
                );
                if (originalIndex === currentPuzzleData.oddIndex) {
                  className +=
                    selectedIndex === index ? " correct" : " correct-highlight";
                } else if (selectedIndex === index) {
                  className += " incorrect";
                }
              } else {
                className += selectedIndex === index ? " selected" : "";
              }

              return (
                <button
                  key={index}
                  className={className}
                  onClick={() => handleItemClick(index)}
                  disabled={showResult}
                >
                  <div className="item-emoji">{item.emoji}</div>
                  <div className="item-name">{item.name}</div>
                </button>
              );
            })}
          </div>
        </div>

        {showResult && (
          <div
            className={`result-message ${isCorrect ? "success" : "try-again"}`}
          >
            {isCorrect ? (
              <>
                <h2>✓ Correct! Well spotted!</h2>
                <p>You found the odd one out!</p>
              </>
            ) : (
              <>
                <h2>Not quite right, but that's okay!</h2>
                <p>Try looking for what's different from the others.</p>
              </>
            )}
            <button className="next-button" onClick={nextPuzzle}>
              Next Puzzle
            </button>
          </div>
        )}

        {!showResult && (
          <div className="game-controls">
            <button className="skip-button" onClick={nextPuzzle}>
              Skip Puzzle
            </button>
            <button className="reset-button" onClick={reset}>
              Reset Game
            </button>
          </div>
        )}
      </div>
    </GameLayout>
  );
};

export default SpotTheOddOne;
