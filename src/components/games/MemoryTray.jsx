import React, { useState, useEffect, useCallback } from "react";
import GameLayout from "./GameLayout";
import "./MemoryTray.css";

const MemoryTray = () => {
  const allObjects = [
    { id: 1, name: "Keys", emoji: "🔑" },
    { id: 2, name: "Glasses", emoji: "👓" },
    { id: 3, name: "Apple", emoji: "🍎" },
    { id: 4, name: "Comb", emoji: "🪮" },
    { id: 5, name: "Watch", emoji: "⌚" },
    { id: 6, name: "Pen", emoji: "✏️" },
    { id: 7, name: "Book", emoji: "📖" },
    { id: 8, name: "Phone", emoji: "📱" },
  ];

  const [level, setLevel] = useState(1); // 1 = Easy, 2 = Hard
  const [objects, setObjects] = useState([]);
  const [showTray, setShowTray] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const startNewRound = useCallback(() => {
    const count = level === 1 ? 3 : 5;
    const shuffled = [...allObjects]
      .sort(() => Math.random() - 0.5)
      .slice(0, count);
    setObjects(shuffled);
    setShowTray(true);
    setSelectedItems([]);
    setShowResult(false);
  }, [level]);

  useEffect(() => {
    startNewRound();
  }, [startNewRound]);

  const handleStart = () => {
    setShowTray(true);
    setTimeout(() => {
      setShowTray(false);
    }, 3000);
  };

  const handleItemSelect = (item) => {
    if (level === 1) {
      // Easy level: just select one
      setSelectedItems([item]);
      checkAnswer([item]);
    } else {
      // Hard level: select multiple
      if (selectedItems.find((i) => i.id === item.id)) {
        setSelectedItems(selectedItems.filter((i) => i.id !== item.id));
      } else {
        setSelectedItems([...selectedItems, item]);
      }
    }
  };

  const checkAnswer = (items = selectedItems) => {
    if (level === 1) {
      const correct =
        items.length === 1 && objects.find((o) => o.id === items[0].id);
      setShowResult(true);
      if (correct) {
        setScore(score + 1);
      }
    } else {
      // For hard level, check when they click "Check"
      const selectedIds = items.map((i) => i.id).sort();
      const correctIds = objects.map((o) => o.id).sort();
      const isCorrect =
        selectedIds.length === correctIds.length &&
        selectedIds.every((id, index) => id === correctIds[index]);
      setShowResult(true);
      if (isCorrect) {
        setScore(score + 1);
      }
    }
  };

  const allDistractors = [...allObjects].filter(
    (obj) => !objects.find((o) => o.id === obj.id)
  );
  const options =
    level === 1
      ? [objects[0], allDistractors[0]].sort(() => Math.random() - 0.5)
      : [...allObjects];

  return (
    <GameLayout title="Memory Tray">
      <div className="memory-tray">
        <div className="level-selector">
          <button
            className={`level-btn ${level === 1 ? "active" : ""}`}
            onClick={() => setLevel(1)}
          >
            Easy (3 items)
          </button>
          <button
            className={`level-btn ${level === 2 ? "active" : ""}`}
            onClick={() => setLevel(2)}
          >
            Hard (5 items)
          </button>
        </div>

        <div className="score-display">
          <p>Score: {score}</p>
        </div>

        {showTray && objects.length > 0 && (
          <div className="tray-container">
            <h2>Look carefully at the tray...</h2>
            <div className="tray">
              {objects.map((obj) => (
                <div key={obj.id} className="tray-item">
                  <div className="item-emoji">{obj.emoji}</div>
                  <div className="item-name">{obj.name}</div>
                </div>
              ))}
            </div>
            <p className="timer-text">Remember these items!</p>
          </div>
        )}

        {!showTray && !showResult && (
          <div className="question-container">
            {level === 1 ? (
              <>
                <h2>Which item was on the tray?</h2>
                <div className="options-grid">
                  {options.map((obj) => (
                    <button
                      key={obj.id}
                      className={`option-item ${
                        selectedItems.find((i) => i.id === obj.id)
                          ? "selected"
                          : ""
                      }`}
                      onClick={() => handleItemSelect(obj)}
                    >
                      <div className="item-emoji">{obj.emoji}</div>
                      <div className="item-name">{obj.name}</div>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <h2>Tap all the items you saw on the tray:</h2>
                <div className="options-grid">
                  {options.map((obj) => {
                    const isOnTray = objects.find((o) => o.id === obj.id);
                    const isSelected = selectedItems.find(
                      (i) => i.id === obj.id
                    );
                    return (
                      <button
                        key={obj.id}
                        className={`option-item ${
                          isSelected ? "selected" : ""
                        }`}
                        onClick={() => handleItemSelect(obj)}
                      >
                        <div className="item-emoji">{obj.emoji}</div>
                        <div className="item-name">{obj.name}</div>
                      </button>
                    );
                  })}
                </div>
                <button className="check-button" onClick={() => checkAnswer()}>
                  Check Answer
                </button>
              </>
            )}
          </div>
        )}

        {!showTray && showResult && (
          <div className="result-container">
            {level === 1 ? (
              selectedItems[0] &&
              objects.find((o) => o.id === selectedItems[0].id) ? (
                <div className="result-message success">
                  <h2>✓ Correct! Well done!</h2>
                  <p>You remembered the {selectedItems[0].name}!</p>
                </div>
              ) : (
                <div className="result-message try-again">
                  <h2>Not quite right, but that's okay!</h2>
                  <p>
                    The correct answer was:{" "}
                    {objects.map((o) => o.name).join(", ")}
                  </p>
                </div>
              )
            ) : (
              (() => {
                const selectedIds = selectedItems.map((i) => i.id).sort();
                const correctIds = objects.map((o) => o.id).sort();
                const isCorrect =
                  selectedIds.length === correctIds.length &&
                  selectedIds.every((id, index) => id === correctIds[index]);
                return isCorrect ? (
                  <div className="result-message success">
                    <h2>✓ Perfect! You remembered all the items!</h2>
                    <p>Great memory work!</p>
                  </div>
                ) : (
                  <div className="result-message try-again">
                    <h2>Good try! The correct items were:</h2>
                    <p>{objects.map((o) => o.name).join(", ")}</p>
                  </div>
                );
              })()
            )}
            <button className="next-round-button" onClick={startNewRound}>
              Try Again
            </button>
          </div>
        )}

        {showTray && (
          <button className="start-button" onClick={handleStart}>
            Start Timer (3 seconds)
          </button>
        )}
      </div>
    </GameLayout>
  );
};

export default MemoryTray;
