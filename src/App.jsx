import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CognitiveScoreProvider } from "./contexts/CognitiveScoreContext";
import CognitiveScoreDisplay from "./components/CognitiveScoreDisplay";
import MainMenu from "./components/MainMenu";
import DailyRoutine from "./components/games/DailyRoutine";
import PurblePairs from "./components/games/PurblePairs";
import MemoryTray from "./components/games/MemoryTray";
import GroceryAisle from "./components/games/GroceryAisle";
import FacesAndNames from "./components/games/FacesAndNames";
import SpotTheOddOne from "./components/games/SpotTheOddOne";
import "./App.css";

function App() {
  return (
    <CognitiveScoreProvider>
      <Router>
        <div className="app">
          <CognitiveScoreDisplay />
          <Routes>
            <Route path="/" element={<MainMenu />} />
            <Route path="/daily-routine" element={<DailyRoutine />} />
            <Route path="/musical-time-travel" element={<PurblePairs />} />
            <Route path="/memory-tray" element={<MemoryTray />} />
            <Route path="/grocery-aisle" element={<GroceryAisle />} />
            <Route path="/faces-and-names" element={<FacesAndNames />} />
            <Route path="/spot-the-odd-one" element={<SpotTheOddOne />} />
          </Routes>
        </div>
      </Router>
    </CognitiveScoreProvider>
  );
}

export default App;
