import React, { createContext, useContext, useState, useEffect } from "react";
import {
  calculateMentalStability,
  getAlzheimersLevel,
} from "../utils/cognitiveCalculator";

const CognitiveScoreContext = createContext();

export const useCognitiveScore = () => {
  const context = useContext(CognitiveScoreContext);
  if (!context) {
    throw new Error(
      "useCognitiveScore must be used within CognitiveScoreProvider"
    );
  }
  return context;
};

export const CognitiveScoreProvider = ({ children }) => {
  const [gameScores, setGameScores] = useState(() => {
    // Load from localStorage
    const saved = localStorage.getItem("cognitiveGameScores");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return {
          memoryTray: 0,
          facesAndNames: 0,
          spotTheOddOne: 0,
          musicalTimeTravel: 0,
          dailyRoutine: 0,
          groceryAisle: 0,
        };
      }
    }
    return {
      memoryTray: 0,
      facesAndNames: 0,
      spotTheOddOne: 0,
      musicalTimeTravel: 0,
      dailyRoutine: 0,
      groceryAisle: 0,
    };
  });

  const [dcsHistory, setDcsHistory] = useState(() => {
    // Load history from localStorage
    const saved = localStorage.getItem("cognitiveDcsHistory");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // Save to localStorage whenever scores change
  useEffect(() => {
    localStorage.setItem("cognitiveGameScores", JSON.stringify(gameScores));
  }, [gameScores]);

  useEffect(() => {
    localStorage.setItem("cognitiveDcsHistory", JSON.stringify(dcsHistory));
  }, [dcsHistory]);

  const updateGameScore = (gameName, accuracy) => {
    setGameScores((prev) => {
      const updated = { ...prev, [gameName]: accuracy };

      // Calculate new DCS and add to history
      const result = calculateMentalStability(updated, dcsHistory);
      const newHistory = [...dcsHistory, result.score];
      setDcsHistory(newHistory);

      return updated;
    });
  };

  const getCurrentMetrics = () => {
    const result = calculateMentalStability(gameScores, dcsHistory);
    const levelInfo = getAlzheimersLevel(result.score);
    return {
      ...result,
      level: levelInfo.level,
      levelDescription: levelInfo.description,
      levelColor: levelInfo.color,
    };
  };

  const resetScores = () => {
    setGameScores({
      memoryTray: 0,
      facesAndNames: 0,
      spotTheOddOne: 0,
      musicalTimeTravel: 0,
      dailyRoutine: 0,
      groceryAisle: 0,
    });
    setDcsHistory([]);
  };

  return (
    <CognitiveScoreContext.Provider
      value={{
        gameScores,
        updateGameScore,
        getCurrentMetrics,
        resetScores,
        dcsHistory,
      }}
    >
      {children}
    </CognitiveScoreContext.Provider>
  );
};
