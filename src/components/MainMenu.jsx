import React from "react";
import { useNavigate } from "react-router-dom";
import "./MainMenu.css";

const MainMenu = () => {
  const navigate = useNavigate();

  const games = [
    {
      path: "/daily-routine",
      name: "Daily Routine",
      description: "Arrange steps in order",
    },
    {
      path: "/musical-time-travel",
      name: "Musical Time Travel",
      description: "Finish the lyric",
    },
    {
      path: "/memory-tray",
      name: "Memory Tray",
      description: "Remember what you saw",
    },
    {
      path: "/grocery-aisle",
      name: "Grocery Aisle",
      description: "Sort items into categories",
    },
    {
      path: "/faces-and-names",
      name: "Faces & Names",
      description: "Match photos to names",
    },
    {
      path: "/spot-the-odd-one",
      name: "Spot the Odd One",
      description: "Find what's different",
    },
  ];

  return (
    <div className="main-menu">
      <h1 className="main-title">Memory Games</h1>
      <p className="subtitle">Choose a game to play</p>
      <div className="games-grid">
        {games.map((game) => (
          <button
            key={game.path}
            className="game-card"
            onClick={() => navigate(game.path)}
          >
            <h2>{game.name}</h2>
            <p>{game.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MainMenu;
