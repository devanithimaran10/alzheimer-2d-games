import React from "react";
import { useNavigate } from "react-router-dom";
import "./GameLayout.css";

const GameLayout = ({ children, title }) => {
  const navigate = useNavigate();

  return (
    <div className="game-layout">
      <div className="game-header">
        <button className="back-button" onClick={() => navigate("/")}>
          ← Back to Menu
        </button>
        <h1 className="game-title">{title}</h1>
      </div>
      <div className="game-content">{children}</div>
    </div>
  );
};

export default GameLayout;
