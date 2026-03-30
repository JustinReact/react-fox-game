# React Fox Game

A fun and interactive click the fox game built with React, Typescript, CSS and Jest for testing. The game challenges players to click on a fox that appears randomly on the screen within a time limit. The player's score increases with each successful click, and the game ends when the timer runs out.

## Features

- Fetch fox images from an API, as well as cat and dog images from different APIs
- Randomly position the fox on the screen
- Timer-based gameplay
- Score tracking
- Images are all displayed at the same time

## Installation

```bash
nvm use 22.12.0
npm install
```

## Usage

```bash
npm run dev
```

Runs the game in development mode. Open [http://localhost:3000](http://localhost:3000) to play.

## Build

```bash
npm run build
```

Builds the app for production to the `build` folder.

## Test

```bash
npm run test
```

Runs the tests for the game.

## Notes

- Preloading images to avoid flickering
- Timer-based game loop
- LocalStorage scoreboard persistence

## Technologies

- React
- JavaScript
- CSS
- Jest (for testing)
- React Testing Library (for testing)
