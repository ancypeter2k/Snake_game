"use client";

import React, { useEffect, useState } from "react";

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
// Since this is a 2D game --> It has only x-axis and y-axis
type Point = {
  x: number;
  y: number;
};

const GRID_SIZE = 20; // 20 - rows & 20 - cols
const INITIAL_SNAKE_LENGTH = 3;
const INITIAL_DIRECTION: Direction = "RIGHT";

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>([]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState<boolean>(false);

  const [score, setScore] = useState(0); // Track score
  const [isPaused, setIsPaused] = useState(false); // Toggle pause/play

  // Movement logic
  const moveSnake = () => {
    if (isPaused || gameOver) return; // Don't move if paused or game over

    const newSnake = [...snake]; // Copy current snake
    const head = { ...newSnake[0] }; // Get current head

    switch (direction) {
      case "UP":
        head.y -= 1;
        break;
      case "DOWN":
        head.y += 1;
        break;
      case "LEFT":
        head.x -= 1;
        break;
      case "RIGHT":
        head.x += 1;
        break;
    }

    // Check boundaries and self-collision (If head goes outside grid, or touches its own body → game over)
    if (
      head.x < 0 ||
      head.x >= GRID_SIZE ||
      head.y < 0 ||
      head.y >= GRID_SIZE ||
      newSnake.some((seg) => seg.x === head.x && seg.y === head.y)
    ) {
      setGameOver(true);
      return;
    }

    newSnake.unshift(head); // add new head at front

    // Eating food
    if (head.x === food.x && head.y === food.y) {
      setScore((prev) => prev + 10); // Add 10 points
      generateFood(newSnake); // Place new food
    } else {
      newSnake.pop(); // remove tail if no food (keeps length same)
    }
    setSnake(newSnake); // update state
  };

  const restartGame = () => {
    const initialSnake: Point[] = [];
    for (let i = INITIAL_SNAKE_LENGTH - 1; i >= 0; i--) {
      initialSnake.push({ x: i, y: 0 });
    }

    setSnake(initialSnake);
    setFood({ x: 5, y: 5 }); // Reset food position
    setDirection(INITIAL_DIRECTION);
    setScore(0); // Reset score
    setGameOver(false); // Clear game over state
    setIsPaused(false); // Resume game
  };

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowUp" && direction !== "DOWN") {
        setDirection("UP");
      }
      if (event.key === "ArrowDown" && direction !== "UP") {
        setDirection("DOWN");
      }
      if (event.key === "ArrowLeft" && direction !== "RIGHT") {
        setDirection("LEFT");
      }
      if (event.key === "ArrowRight" && direction !== "LEFT") {
        setDirection("RIGHT");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (!gameOver) {
      const interval = setInterval(moveSnake, 150); // Moves the snake every 150ms
      return () => clearInterval(interval);
    }
  }, [snake, direction, gameOver]); // Automatically stops if gameOver = true

  useEffect(() => {
    const initialSnake: Point[] = [];
    for (let i = INITIAL_SNAKE_LENGTH - 1; i >= 0; i--) {
      initialSnake.push({ x: i, y: 0 }); // [{2,0}, {1,0}, {0,0}]
    }
    setSnake(initialSnake);
    generateFood(initialSnake);
  }, []);

  const generateFood = (snakeBody: Point[]) => {
    let newFood: Point;
    do {
      newFood = {
        // -> Random position within grid
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (
      snakeBody.some((seg) => seg.x === newFood.x && seg.y === newFood.y) // -> Ensures food does not appear on the snake
    );
    setFood(newFood);
  };

  useEffect(() => {
    if (!gameOver && !isPaused) {
      const interval = setInterval(moveSnake, 150);
      return () => clearInterval(interval);
    }
  }, [snake, direction, gameOver, isPaused]);

  return (
    <div className="text-center mt-10 space-y-6 font-sans">
      <h2 className="text-3xl font-extrabold tracking-widest  drop-shadow-md ">
        🎮 <span  className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-500 via-gray-800 to-pink-500 
             uppercase tracking-widest  drop-shadow-md ">Game Time!</span>
      </h2>
      <h1 className="text-5xl font-black text-green-600 tracking-widest  drop-shadow-md animate-bounce">
        🐍 Snake <span className="text-red-600">&</span> 🍓 Fruits
      </h1>
      <p className="text-yellow-600 text-base italic tracking-tight animate-pulse">
        Let the chase begin... 🏃‍♂️
      </p>

      <div className="flex justify-center items-center">
        <div
          className="relative"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${GRID_SIZE}, 20px)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 20px)`,
            border: "2px solid black",
            position: "relative",
          }}
        >
          {/* Creating an array of empty values, length = total number of cells in the grid.
          If GRID_SIZE = 20, this creates 20 * 20 = 400 cells.
              2D grid from 1D array using index math */}
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            {
              /* .map() loops through the array, 
              _ means you’re ignoring the actual value (it’s just undefined),
              i is the index (0 to 399) of each cell*/
            }
            const x = i % GRID_SIZE;
            // Calculates the x-position (column) of the cell. Ex: If GRID_SIZE = 20 and i = 23, then x = 23 % 20 = 3
            const y = Math.floor(i / GRID_SIZE);
            // Calculates the y-position (row) of the cell. Ex: i = 23 → y = Math.floor(23 / 20) = 1
            const isSnake = snake.some((s) => s.x === x && s.y === y);
            // Checks if the current cell (x, y) is part of the snake body. snake is an array of points like: [ {x: 3, y: 5}, {x: 4, y: 5} ]
            // some() returns true if any segment of the snake matches current (x, y)
            const isFood = food.x === x && food.y === y;
            // Checks if the current cell is the food location
            return (
              <div
                key={`${x}-${y}`}
                // Unique key for React rendering
                className={`w-5 h-5 border border-gray-200 ${
                  isSnake ? "bg-green-500" : isFood ? "bg-red-500" : ""
                }`}
              />
            );
          })}
          {gameOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 text-white text-2xl font-bold">
              Game Over!
            </div>
          )}
        </div>
      </div>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold p-1 rounded bg-yellow-400">Score: {score}</h2>

        {!gameOver && (
          <button
            onClick={() => setIsPaused((prev) => !prev)}
            className="px-3 py-1 bg-blue-700 text-white rounded"
          >
            {isPaused ? "Resume" : "Pause"}
          </button>
        )}

        {gameOver && (
          <button
            onClick={restartGame}
            className="px-3 py-1 bg-red-800 text-white rounded"
          >
            Restart
          </button>
        )}
      </div>
    </div>
  );
}
