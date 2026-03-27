import React, { useEffect, useRef, useState } from "react";
import "./Game.css";
import { fetchBoardImages } from "../../services/fetchApi";
import type { GameImage } from "../../types/Types";

type GameProps = {
  playerName: string | null;
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  endGame: () => void;
};

export const Game: React.FC<GameProps> = ({
  playerName,
  score,
  setScore,
  endGame,
}) => {
  const [timeLeft, setTimeLeft] = useState(30);
  const [images, setImages] = useState<GameImage[]>([]);
  const [nextImages, setNextImages] = useState<GameImage[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const gameEndedRef = useRef(false);

  // Timer logic
  useEffect(() => {
    if (!gameStarted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (!gameEndedRef.current) {
            gameEndedRef.current = true;
            endGame();
          }
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [endGame, gameStarted]);

  // Prevent image flickering when they first appear, even if they're already loaded in state.
  const preloadImage = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = src;
      image.onload = () => resolve();
      image.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    });
  };

  // Preload all images for the next board before setting them in state to ensure they appear immediately when the board changes, eliminating any flickering or loading delays between boards.
  const preloadBoardImages = async (
    images: GameImage[],
  ): Promise<GameImage[]> => {
    if (!Array.isArray(images)) return [];
    await Promise.all(images.map((image) => preloadImage(image.url)));
    return images;
  };

  // Preload next board while the current one is being played to avoid loading times between image sets
  const preloadNextBoard = async () => {
    try {
      const images = await fetchBoardImages();
      if (!Array.isArray(images) || images.length === 0) {
        setNextImages([]);
        return;
      }
      const preloadedImages = await preloadBoardImages(images);
      setNextImages(preloadedImages);
    } catch (error) {
      console.error("Failed to preload next board:", error);
    }
  };

  // Fetch the initial set of images when the component mounts. We also start preloading the next board immediately after the first one is loaded to ensure a smooth transition between boards. If there's an error during fetching, we log it and ensure that the loading state is updated to avoid leaving the player stuck on a loading screen indefinitely.
  useEffect(() => {
    const initializeBoards = async () => {
      try {
        const images = await fetchBoardImages();
        if (!Array.isArray(images) || images.length === 0) {
          setNextImages([]);
          return;
        }
        const preloadedImages = await preloadBoardImages(images);
        setImages(preloadedImages);
        setLoading(false);
        setGameStarted(true);
        void preloadNextBoard();
      } catch (error) {
        console.error("Failed to fetch board images:", error);
      } finally {
        setLoading(false);
      }
    };
    initializeBoards();
  }, []);

  // When an image is clicked, update the score and load the next set of images. If the next set isn't ready for some reason, fetch a new one immediately to avoid leaving the player waiting. Use a transition state to prevent multiple clicks, and also to wait gracefully for the next board to be ready if it isn't already preloaded, ensuring a smooth user experience without any loading delays or flickering between boards.
  const handleImageClick = (type: string) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setScore((prev) => {
      if (type === "fox") {
        return prev + 1;
      } else if (prev > 0) {
        return prev - 1;
      } else {
        return 0;
      }
    });
    if (nextImages.length > 0) {
      setImages(nextImages);
      setNextImages([]);
      void preloadNextBoard();
      setIsTransitioning(false);
      return;
    }
    // If for some reason the next board isn't ready, fetch a new one immediately
    const fetchNewBoard = async () => {
      setLoading(true);
      try {
        const images = await fetchBoardImages();
        if (!Array.isArray(images) || images.length === 0) {
          setNextImages([]);
          return;
        }
        const preloadedImages = await preloadBoardImages(images);
        setImages(preloadedImages);
        void preloadNextBoard();
      } catch (error) {
        console.error("Failed to fetch new board images:", error);
      } finally {
        setLoading(false);
        setIsTransitioning(false);
      }
    };
    void fetchNewBoard();
  };

  return (
    <div className="container">
      <h1 className="title">{`Good luck, ${playerName}!`}</h1>
      <div className="main-row">
        <p>Score: {score}</p>
        <p>You have: {timeLeft}s left!</p>
      </div>
      {loading && images.length === 0 ? (
        <div className="board">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="skeleton-tile" />
          ))}
        </div>
      ) : (
        <div className={`board ${isTransitioning ? "transitioning" : ""}`}>
          {images.map((image) => (
            <img
              className="image"
              key={image.id}
              src={image.url}
              alt={image.type}
              onClick={() => {
                handleImageClick(image.type);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
