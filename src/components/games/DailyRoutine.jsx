import React, { useState } from "react";
import GameLayout from "./GameLayout";
import "./DailyRoutine.css";

const DailyRoutine = () => {
  const routines = [
    {
      name: "Making a Cup of Tea",
      steps: [
        { id: 1, text: "Boil water", image: "☕" },
        { id: 2, text: "Put tea bag in cup", image: "🫖" },
        { id: 3, text: "Pour water", image: "💧" },
        { id: 4, text: "Add milk", image: "🥛" },
      ],
    },
    {
      name: "Brushing Teeth",
      steps: [
        { id: 1, text: "Wet toothbrush", image: "💧" },
        { id: 2, text: "Apply toothpaste", image: "🧴" },
        { id: 3, text: "Brush teeth", image: "🦷" },
        { id: 4, text: "Rinse mouth", image: "🚰" },
      ],
    },
    {
      name: "Getting Dressed",
      steps: [
        { id: 1, text: "Put on underwear", image: "👕" },
        { id: 2, text: "Put on shirt", image: "👔" },
        { id: 3, text: "Put on pants", image: "👖" },
        { id: 4, text: "Put on shoes", image: "👞" },
      ],
    },
  ];

  const [currentRoutine, setCurrentRoutine] = useState(0);
  const [selectedSteps, setSelectedSteps] = useState([]);
  const [availableSteps, setAvailableSteps] = useState(
    [...routines[currentRoutine].steps].sort(() => Math.random() - 0.5)
  );
  const [showHint, setShowHint] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleStepClick = (step) => {
    if (completed) return;

    setSelectedSteps([...selectedSteps, step]);
    setAvailableSteps(availableSteps.filter((s) => s.id !== step.id));
    setShowHint(false);
  };

  const handleRemoveStep = (step, index) => {
    if (completed) return;

    setSelectedSteps(selectedSteps.filter((_, i) => i !== index));
    setAvailableSteps(
      [...availableSteps, step].sort(() => Math.random() - 0.5)
    );
  };

  const checkOrder = () => {
    const correct = selectedSteps.every((step, index) => step.id === index + 1);
    if (correct) {
      setCompleted(true);
    } else {
      // Gently guide incorrect cards back
      setTimeout(() => {
        setAvailableSteps([...availableSteps, ...selectedSteps]);
        setSelectedSteps([]);
      }, 1000);
    }
  };

  const handleHint = () => {
    if (
      completed ||
      selectedSteps.length >= routines[currentRoutine].steps.length
    )
      return;
    setShowHint(true);
    const nextStepId = selectedSteps.length + 1;
    const nextStep = routines[currentRoutine].steps.find(
      (s) => s.id === nextStepId
    );
    // Highlight the next step
    setTimeout(() => setShowHint(false), 2000);
  };

  const nextRoutine = () => {
    const next = (currentRoutine + 1) % routines.length;
    setCurrentRoutine(next);
    setSelectedSteps([]);
    setAvailableSteps(
      [...routines[next].steps].sort(() => Math.random() - 0.5)
    );
    setCompleted(false);
    setShowHint(false);
  };

  const reset = () => {
    setSelectedSteps([]);
    setAvailableSteps(
      [...routines[currentRoutine].steps].sort(() => Math.random() - 0.5)
    );
    setCompleted(false);
    setShowHint(false);
  };

  return (
    <GameLayout title="Daily Routine Sequencer">
      <div className="daily-routine">
        <div className="routine-selector">
          <h2>{routines[currentRoutine].name}</h2>
          <button className="change-routine-btn" onClick={nextRoutine}>
            Try Another Routine
          </button>
        </div>

        <div className="instructions">
          <p>Arrange the steps in the correct order</p>
        </div>

        <div className="selected-steps-container">
          <h3>Your Order:</h3>
          <div className="selected-steps">
            {selectedSteps.length === 0 ? (
              <div className="empty-slot">
                Click steps below to add them here
              </div>
            ) : (
              selectedSteps.map((step, index) => (
                <div
                  key={`${step.id}-${index}`}
                  className={`step-card selected ${
                    showHint && step.id === selectedSteps.length + 1
                      ? "hint-highlight"
                      : ""
                  }`}
                  onClick={() => handleRemoveStep(step, index)}
                >
                  <div className="step-number">{index + 1}</div>
                  <div className="step-image">{step.image}</div>
                  <div className="step-text">{step.text}</div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="available-steps-container">
          <h3>Available Steps:</h3>
          <div className="available-steps">
            {availableSteps.map((step) => (
              <div
                key={step.id}
                className={`step-card available ${
                  showHint && step.id === selectedSteps.length + 1
                    ? "hint-highlight"
                    : ""
                }`}
                onClick={() => handleStepClick(step)}
              >
                <div className="step-image">{step.image}</div>
                <div className="step-text">{step.text}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="game-controls">
          <button className="hint-button" onClick={handleHint}>
            💡 Hint
          </button>
          <button className="check-button" onClick={checkOrder}>
            Check Order
          </button>
          <button className="reset-button" onClick={reset}>
            Reset
          </button>
        </div>

        {completed && (
          <div className="success-message">
            <h2>✓ Great job! You got it right!</h2>
            <button className="next-button" onClick={nextRoutine}>
              Try Another Routine
            </button>
          </div>
        )}
      </div>
    </GameLayout>
  );
};

export default DailyRoutine;
