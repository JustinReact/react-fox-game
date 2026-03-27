import "./StartScreen.css";

type StartScreenProps = {
  playerName: string | null;
  setInputtedName: (name: string) => void;
  startGame: () => void;
  gameReady: boolean;
  inputtedName: string;
  changeName: () => void;
};

export const StartScreen: React.FC<StartScreenProps> = ({
  playerName,
  startGame,
  gameReady,
  inputtedName,
  setInputtedName,
  changeName,
}: StartScreenProps) => {
  return (
    <div className="container">
      <h1 className="title">
        Welcome to the <strong>Click The Fox</strong> Game!
      </h1>
      {gameReady ? (
        <div className="name-col">
          <h2
            className="editable-name"
            onClick={changeName}
          >{`Hello ${playerName}`}</h2>
          <p className="text">
            Click the button below to start playing, or click on your name to
            change it before you start. Good luck, and have fun playing!
          </p>
        </div>
      ) : (
        <>
          <p>
            Please enter your name below, and then click the button to start
            playing.
          </p>
          <input
            type="text"
            placeholder="Enter your name"
            value={inputtedName}
            onChange={(e) => setInputtedName(e.target.value)}
            className="name-input"
          />
        </>
      )}
      <button
        className="button"
        type="button"
        disabled={!gameReady && !inputtedName.trim()}
        onClick={startGame}
      >
        PLAY!
      </button>
    </div>
  );
};
