import { useState } from "react";
import "./App.css";
import { StartScreen } from "./components/StartScreen/StartScreen";
import { Game } from "./components/Game/Game";
import { Scoreboard } from "./components/Scoreboard/Scoreboard";
import type { ScoreEntry } from "./types/Types";

function App() {
  type Screen = "start" | "game" | "scoreboard";

  const [screen, setScreen] = useState<Screen>("start");
  const [score, setScore] = useState(0);
  const [inputtedName, setInputtedName] = useState("");
  const [playerName, setPlayerName] = useState<string | null>(null);
  const [gameReady, setGameReady] = useState(false);

  // Start the game by switching to the game screen and resetting the score to 0. Or set the game to "ready" when they haven't chosen a name yet which can then be changed
  const startGame = () => {
    if (!gameReady) {
      if (!inputtedName.trim()) return;

      setPlayerName(inputtedName.trim());
      setGameReady(true);
      return;
    }

    setScreen("game");
    setScore(0);
  };

  const changeName = () => {
    setGameReady(false);
  };

  // When the game ends, we create a new score entry and save it to localStorage. We then switch to the scoreboard screen to show the player their results.
  const endGame = () => {
    const newEntry: ScoreEntry = {
      playerName: playerName ?? "",
      score,
      date: new Date(),
      rank: 0,
    };
    const existing = localStorage.getItem("scoreboard");
    const scoreboard: ScoreEntry[] = existing ? JSON.parse(existing) : [];
    // Keep only top 10 scores and sort them in descending order by score
    const updatedScoreboard = [...scoreboard, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map((entry, index) => ({
        ...entry,
        rank: index === 0 ? "1 👑" : (index + 1).toString(),
      }));
    localStorage.setItem("scoreboard", JSON.stringify(updatedScoreboard));
    setScreen("scoreboard");
  };

  // Reset everything to go back to the start screen, allowing the player to enter a new name and start fresh
  const backToStart = () => {
    setScreen("start");
    setScore(0);
    setPlayerName(null);
    setInputtedName("");
    setGameReady(false);
  };

  const renderScreen = () => {
    if (screen === "start")
      return (
        <StartScreen
          playerName={playerName}
          inputtedName={inputtedName}
          setInputtedName={setInputtedName}
          startGame={startGame}
          gameReady={gameReady}
          changeName={changeName}
        />
      );
    if (screen === "game")
      return (
        <Game
          playerName={playerName}
          score={score}
          setScore={setScore}
          endGame={endGame}
        />
      );
    if (screen === "scoreboard")
      return <Scoreboard backToStart={backToStart} playAgain={startGame} />;
    return null;
  };

  return <div className="wrapper">{renderScreen()}</div>;
}

export default App;
