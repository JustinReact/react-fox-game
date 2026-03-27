export type AnimalType = "fox" | "dog" | "cat";

export type GameImage = {
  id: string;
  type: AnimalType;
  url: string;
};

export type ScoreEntry = {
  rank: number;
  playerName: string;
  score: number;
  date: Date;
};
