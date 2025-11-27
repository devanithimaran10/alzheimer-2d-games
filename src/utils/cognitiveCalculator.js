/**
 * Calculates the Digital Cognitive Score and Stability Index
 * @param {Object} gameData - Object containing accuracy (0-1) for each game
 * @param {Array} history - Array of previous DCS scores for the patient
 */
export const calculateMentalStability = (gameData, history = []) => {
  // 1. Group Games by Cognitive Domain
  const memoryScore = (gameData.memoryTray + gameData.facesAndNames) / 2;
  const attentionScore = (gameData.spotTheOddOne + gameData.musicalTimeTravel) / 2;
  const executiveScore = (gameData.dailyRoutine + gameData.groceryAisle) / 2;

  // 2. Define Weights (Alzheimer's focus: Memory is highest priority)
  const W_MEMORY = 0.5;
  const W_ATTENTION = 0.2;
  const W_EXECUTIVE = 0.3;

  // 3. Calculate Current Digital Cognitive Score (DCS)
  // Result is between 0 and 100
  const currentDCS = (
    (memoryScore * W_MEMORY) + 
    (attentionScore * W_ATTENTION) + 
    (executiveScore * W_EXECUTIVE)
  ) * 100;

  // 4. Calculate Stability (Trend Analysis)
  let stabilityStatus = "Establishing Baseline";
  let stabilityIndex = 1.0;
  
  if (history.length > 0) {
    // Calculate average of last 5 sessions (Moving Average)
    const recentHistory = history.slice(-5);
    const baselineAvg = recentHistory.reduce((a, b) => a + b, 0) / recentHistory.length;
    
    // Formula: Current Score divided by Baseline
    stabilityIndex = currentDCS / baselineAvg;
    
    if (stabilityIndex > 1.05) stabilityStatus = "Improving";
    else if (stabilityIndex >= 0.95) stabilityStatus = "Stable";
    else if (stabilityIndex >= 0.85) stabilityStatus = "Mild Decline";
    else stabilityStatus = "Significant Decline";
  }

  return {
    score: Math.round(currentDCS),
    stabilityIndex: parseFloat(stabilityIndex.toFixed(2)),
    status: stabilityStatus,
    breakdown: {
      memory: Math.round(memoryScore * 100),
      attention: Math.round(attentionScore * 100),
      executive: Math.round(executiveScore * 100)
    }
  };
};

/**
 * Get Alzheimer's patient level based on DCS score
 * @param {number} dcs - Digital Cognitive Score (0-100)
 * @returns {Object} Level information
 */
export const getAlzheimersLevel = (dcs) => {
  if (dcs >= 80) {
    return {
      level: "Mild Cognitive Impairment (MCI)",
      description: "Early stage - minimal cognitive decline",
      color: "#4CAF50"
    };
  } else if (dcs >= 60) {
    return {
      level: "Mild Alzheimer's",
      description: "Mild dementia - some memory and cognitive issues",
      color: "#FF9800"
    };
  } else if (dcs >= 40) {
    return {
      level: "Moderate Alzheimer's",
      description: "Moderate dementia - significant cognitive decline",
      color: "#FF5722"
    };
  } else {
    return {
      level: "Severe Alzheimer's",
      description: "Severe dementia - extensive cognitive decline",
      color: "#F44336"
    };
  }
};

