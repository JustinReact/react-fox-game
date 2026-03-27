import { useState } from "react";
import "./Scoreboard.css";
import type { ScoreEntry } from "../../types/Types";

type ScoreboardProps = {
  backToStart: () => void;
  playAgain: () => void;
};

export const Scoreboard: React.FC<ScoreboardProps> = ({
  backToStart,
  playAgain,
}) => {
  const [scores] = useState<ScoreEntry[]>(() => {
    const existing = localStorage.getItem("scoreboard");
    return existing ? JSON.parse(existing) : [];
  });

  return (
    <div className="container">
      <h1 className="title">Scoreboard</h1>
      {scores.length === 0 ? (
        <p>No scores yet. Play the game to see your score here!</p>
      ) : (
        <table className="score-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player Name</th>
              <th>Score</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((entry, index) => (
              <tr key={index}>
                <td>{entry.rank}</td>
                <td>{entry.playerName}</td>
                <td>{entry.score}</td>
                <td>{new Date(entry.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="button-row">
        <button
          style={{ backgroundColor: "green" }}
          className="button"
          onClick={backToStart}
        >
          Back to Welcome Screen
        </button>
        <button className="button" onClick={playAgain}>
          Play Again!
        </button>
      </div>
    </div>
  );
};
