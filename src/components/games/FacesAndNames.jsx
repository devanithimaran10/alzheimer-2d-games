import React, { useState, useEffect } from "react";
import GameLayout from "./GameLayout";
import { useCognitiveScore } from "../../contexts/CognitiveScoreContext";
import "./FacesAndNames.css";

const FacesAndNames = () => {
  const { updateGameScore } = useCognitiveScore();
  // Using emojis as placeholders - in real implementation, use actual photos
  const people = [
    { id: 1, name: "Grandson", emoji: "👦", relationship: "Grandson" },
    {
      id: 2,
      name: "Granddaughter",
      emoji: "👧",
      relationship: "Granddaughter",
    },
    { id: 3, name: "Son", emoji: "👨", relationship: "Son" },
    { id: 4, name: "Daughter", emoji: "👩", relationship: "Daughter" },
    { id: 5, name: "Elvis", emoji: "🎤", relationship: "Famous Singer" },
    { id: 6, name: "Marilyn", emoji: "💃", relationship: "Famous Actress" },
  ];

  const [selectedPerson, setSelectedPerson] = useState(null);
  const [selectedName, setSelectedName] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [totalAttempts, setTotalAttempts] = useState(0);

  const availablePeople = people.filter(
    (p) => !matchedPairs.find((pair) => pair.person.id === p.id)
  );
  const availableNames = people.filter(
    (p) => !matchedPairs.find((pair) => pair.name === p.name)
  );

  const handlePersonClick = (person) => {
    if (selectedName && selectedName === person.name) {
      // Correct match
      setMatchedPairs([...matchedPairs, { person, name: person.name }]);
      setSelectedPerson(null);
      setSelectedName(null);
      setShowResult(true);
      setTotalAttempts((prev) => {
        const newTotal = prev + 1;
        const accuracy = (matchedPairs.length + 1) / newTotal;
        updateGameScore("facesAndNames", accuracy);
        return newTotal;
      });
      setTimeout(() => setShowResult(false), 1500);
    } else if (selectedName) {
      // Wrong match
      setSelectedPerson(null);
      setSelectedName(null);
      setTotalAttempts((prev) => {
        const newTotal = prev + 1;
        const accuracy = matchedPairs.length / newTotal;
        updateGameScore("facesAndNames", accuracy);
        return newTotal;
      });
    } else {
      setSelectedPerson(person);
    }
  };

  const handleNameClick = (name) => {
    if (selectedPerson && selectedPerson.name === name) {
      // Correct match
      setMatchedPairs([...matchedPairs, { person: selectedPerson, name }]);
      setSelectedPerson(null);
      setSelectedName(null);
      setShowResult(true);
      setTotalAttempts((prev) => {
        const newTotal = prev + 1;
        const accuracy = (matchedPairs.length + 1) / newTotal;
        updateGameScore("facesAndNames", accuracy);
        return newTotal;
      });
      setTimeout(() => setShowResult(false), 1500);
    } else if (selectedPerson) {
      // Wrong match
      setSelectedPerson(null);
      setSelectedName(null);
      setTotalAttempts((prev) => {
        const newTotal = prev + 1;
        const accuracy = matchedPairs.length / newTotal;
        updateGameScore("facesAndNames", accuracy);
        return newTotal;
      });
    } else {
      setSelectedName(name);
    }
  };

  const reset = () => {
    setMatchedPairs([]);
    setSelectedPerson(null);
    setSelectedName(null);
    setTotalAttempts(0);
  };

  const allMatched = matchedPairs.length === people.length;

  return (
    <GameLayout title="Faces & Names">
      <div className="faces-and-names">
        <div className="instructions">
          <p>Match each person to their name or relationship</p>
        </div>

        <div className="game-area">
          <div className="people-section">
            <h3>People</h3>
            <div className="people-grid">
              {availablePeople.map((person) => (
                <div
                  key={person.id}
                  className={`person-card ${
                    selectedPerson?.id === person.id ? "selected" : ""
                  }`}
                  onClick={() => handlePersonClick(person)}
                >
                  <div className="person-emoji">{person.emoji}</div>
                  <div className="person-relationship">
                    {person.relationship}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="names-section">
            <h3>Names</h3>
            <div className="names-grid">
              {availableNames.map((person) => (
                <button
                  key={person.id}
                  className={`name-button ${
                    selectedName === person.name ? "selected" : ""
                  }`}
                  onClick={() => handleNameClick(person.name)}
                >
                  {person.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {matchedPairs.length > 0 && (
          <div className="matched-pairs">
            <h3>Matched:</h3>
            <div className="matched-list">
              {matchedPairs.map((pair, index) => (
                <div key={index} className="matched-item">
                  <span className="matched-emoji">{pair.person.emoji}</span>
                  <span className="matched-name">{pair.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {showResult && <div className="success-feedback">✓ Great match!</div>}

        {allMatched && (
          <div className="completion-message">
            <h2>🎉 Perfect! You matched everyone correctly!</h2>
            <button className="reset-button" onClick={reset}>
              Play Again
            </button>
          </div>
        )}

        <button className="reset-button" onClick={reset}>
          Reset
        </button>
      </div>
    </GameLayout>
  );
};

export default FacesAndNames;
