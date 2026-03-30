import type { GameImage } from "../types/Types";

const shuffleArray = <T>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const fetchFox = async (): Promise<GameImage> => {
  const response = await fetch("https://randomfox.ca/floof/");

  if (!response.ok) {
    throw new Error("Failed to fetch fox image");
  }

  const data = await response.json();

  return {
    id: crypto.randomUUID(),
    type: "fox",
    url: data.image,
  };
};

const fetchDog = async (): Promise<GameImage> => {
  const response = await fetch("https://dog.ceo/api/breeds/image/random");

  if (!response.ok) {
    throw new Error("Failed to fetch dog image");
  }

  const data = await response.json();

  return {
    id: crypto.randomUUID(),
    type: "dog",
    url: data.message,
  };
};

const fetchCat = async (): Promise<GameImage> => {
  const response = await fetch("https://api.thecatapi.com/v1/images/search?mime_types=jpg,png");

  if (!response.ok) {
    throw new Error("Failed to fetch cat image");
  }

  const data = await response.json();

  return {
    id: crypto.randomUUID(),
    type: "cat",
    url: data[0].url,
  };
};

const fetchRandomNonFox = async (): Promise<GameImage> => {
  return Math.random() < 0.5 ? fetchDog() : fetchCat();
};

export const fetchBoardImages = async (): Promise<GameImage[]> => {   
  const images = await Promise.all([
    fetchFox(),
    ...Array.from({ length: 8 }, () => fetchRandomNonFox()),
  ]);

  return shuffleArray(images);
};