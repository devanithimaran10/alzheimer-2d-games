import React, { useState, useRef } from "react";
import GameLayout from "./GameLayout";
import { useCognitiveScore } from "../../contexts/CognitiveScoreContext";
import "./MusicalTimeTravel.css";

const MusicalTimeTravel = () => {
  const songs = [
    {
      title: "You Are My Sunshine",
      lyrics: [
        "You are my sunshine, my only sunshine",
        "You make me happy",
        "When skies are gray",
      ],
      correctAnswer: 1,
      wrongAnswer: "You make me sad",
    },
    {
      title: "Somewhere Over the Rainbow",
      lyrics: [
        "Somewhere over the rainbow",
        "Way up high",
        "There's a land that I heard of",
      ],
      correctAnswer: 1,
      wrongAnswer: "Way down low",
    },
    {
      title: "What a Wonderful World",
      lyrics: [
        "I see trees of green, red roses too",
        "I see them bloom",
        "For me and you",
      ],
      correctAnswer: 1,
      wrongAnswer: "I see them fade",
    },
  ];

  const { updateGameScore } = useCognitiveScore();
  const [currentSong, setCurrentSong] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const audioRef = useRef(null);

  const handlePlay = () => {
    setIsPlaying(true);
    // In a real implementation, you would play actual audio
    // For now, we'll simulate it
    setTimeout(() => {
      setIsPlaying(false);
    }, 3000);
  };

  const handleAnswer = (answerIndex) => {
    setSelectedAnswer(answerIndex);
    const correct = answerIndex === songs[currentSong].correctAnswer;
    setShowResult(true);

    setTotalAttempts((prev) => {
      const newTotal = prev + 1;
      setScore((prevScore) => {
        const newScore = correct ? prevScore + 1 : prevScore;
        const accuracy = newScore / newTotal;
        updateGameScore("musicalTimeTravel", accuracy);
        return newScore;
      });
      return newTotal;
    });
  };

  const nextSong = () => {
    const next = (currentSong + 1) % songs.length;
    setCurrentSong(next);
    setSelectedAnswer(null);
    setShowResult(false);
    setIsPlaying(false);
  };

  const reset = () => {
    setCurrentSong(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setIsPlaying(false);
    setScore(0);
    setTotalAttempts(0);
  };

  const currentSongData = songs[currentSong];
  const options = [
    currentSongData.lyrics[currentSongData.correctAnswer],
    currentSongData.wrongAnswer,
  ].sort(() => Math.random() - 0.5);

  return (
    <GameLayout title="Musical Time Travel">
      <div className="musical-time-travel">
        <div className="song-info">
          <h2>{currentSongData.title}</h2>
        </div>

        <div className="lyrics-display">
          <div className="lyrics-text">
            {currentSongData.lyrics.slice(0, -1).map((line, index) => (
              <p key={index} className="lyric-line">
                {line}
              </p>
            ))}
            <p className="lyric-line incomplete">...</p>
          </div>
        </div>

        <div className="audio-controls">
          <button
            className="play-button"
            onClick={handlePlay}
            disabled={isPlaying}
          >
            {isPlaying ? "🎵 Playing..." : "▶️ Play Song Clip"}
          </button>
        </div>

        <div className="instructions">
          <p>Complete the lyric by choosing the correct option:</p>
        </div>

        <div className="answer-options">
          {options.map((option, index) => {
            const isCorrect =
              option === currentSongData.lyrics[currentSongData.correctAnswer];
            const isSelected = selectedAnswer === index;
            let className = "answer-option";

            if (showResult) {
              if (isCorrect) {
                className += " correct";
              } else if (isSelected) {
                className += " incorrect";
              }
            } else {
              className += isSelected ? " selected" : "";
            }

            return (
              <button
                key={index}
                className={className}
                onClick={() => !showResult && handleAnswer(index)}
                disabled={showResult}
              >
                {option}
              </button>
            );
          })}
        </div>

        {showResult && (
          <div
            className={`result-message ${
              selectedAnswer === songs[currentSong].correctAnswer
                ? "success"
                : "try-again"
            }`}
          >
            {selectedAnswer === songs[currentSong].correctAnswer ? (
              <>
                <h2>✓ Excellent! You got it right!</h2>
                <p>Music memories are powerful!</p>
              </>
            ) : (
              <>
                <h2>Not quite, but that's okay!</h2>
                <p>
                  The correct answer was: "
                  {currentSongData.lyrics[currentSongData.correctAnswer]}"
                </p>
              </>
            )}
            <button className="next-song-button" onClick={nextSong}>
              Try Another Song
            </button>
          </div>
        )}

        {!showResult && (
          <button className="skip-button" onClick={nextSong}>
            Skip to Next Song
          </button>
        )}
      </div>
    </GameLayout>
  );
};

export default MusicalTimeTravel;
