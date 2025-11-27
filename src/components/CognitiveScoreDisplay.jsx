import React, { useState } from "react";
import { useCognitiveScore } from "../contexts/CognitiveScoreContext";
import "./CognitiveScoreDisplay.css";

const CognitiveScoreDisplay = () => {
  const { getCurrentMetrics } = useCognitiveScore();
  const [showTooltip, setShowTooltip] = useState(false);
  const metrics = getCurrentMetrics();

  return (
    <div
      className="cognitive-score-display"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="score-badge" style={{ borderColor: metrics.levelColor }}>
        <span className="score-label">DCS</span>
        <span className="score-value" style={{ color: metrics.levelColor }}>
          {metrics.score}
        </span>
      </div>

      {showTooltip && (
        <div className="score-tooltip">
          <div className="tooltip-header">
            <h3>Digital Cognitive Score</h3>
            <div
              className="status-badge"
              style={{ backgroundColor: metrics.levelColor }}
            >
              {metrics.status}
            </div>
          </div>

          <div className="tooltip-content">
            <div className="level-info">
              <strong>Level:</strong> {metrics.level}
              <p className="level-description">{metrics.levelDescription}</p>
            </div>

            <div className="breakdown">
              <h4>Score Breakdown:</h4>
              <div className="breakdown-item">
                <span>Memory:</span>
                <span>{metrics.breakdown.memory}%</span>
              </div>
              <div className="breakdown-item">
                <span>Attention:</span>
                <span>{metrics.breakdown.attention}%</span>
              </div>
              <div className="breakdown-item">
                <span>Executive:</span>
                <span>{metrics.breakdown.executive}%</span>
              </div>
            </div>

            {metrics.stabilityIndex !== 1.0 && (
              <div className="stability-info">
                <strong>Stability Index:</strong> {metrics.stabilityIndex}
                <p className="stability-note">
                  {metrics.stabilityIndex > 1.0 && "📈 Showing improvement"}
                  {metrics.stabilityIndex >= 0.95 &&
                    metrics.stabilityIndex <= 1.0 &&
                    "➡️ Stable performance"}
                  {metrics.stabilityIndex < 0.95 &&
                    metrics.stabilityIndex >= 0.85 &&
                    "⚠️ Mild decline detected"}
                  {metrics.stabilityIndex < 0.85 &&
                    "🔴 Significant decline detected"}
                </p>
              </div>
            )}
          </div>

          <div className="tooltip-footer">
            <p className="disclaimer">
              * For tracking purposes only. Not a medical diagnosis.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CognitiveScoreDisplay;
