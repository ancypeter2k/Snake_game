"use client";

import React, { useEffect, useState } from "react";

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Point = { x: number; y: number };

const GRID_SIZE = 20;
const INITIAL_SNAKE_LENGTH = 3;
const INITIAL_DIRECTION: Direction = "RIGHT";

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>([]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState<boolean>(false);

  // Movement logic
  const moveSnake = () => {
    const newSnake = [...snake];
    const head = { ...newSnake[0] };

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

    // Check boundaries and self-collision
    if (
      head.x < 0 || head.x >= GRID_SIZE ||
      head.y < 0 || head.y >= GRID_SIZE ||
      newSnake.some(seg => seg.x === head.x && seg.y === head.y)
    ) {
      setGameOver(true);
      return;
    }

    newSnake.unshift(head);

    // Eating food
    if (head.x === food.x && head.y === food.y) {
      generateFood(newSnake);
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
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
      const interval = setInterval(moveSnake, 150);
      return () => clearInterval(interval);
    }
  }, [snake, direction, gameOver]);

  useEffect(() => {
    const initialSnake: Point[] = [];
    for (let i = INITIAL_SNAKE_LENGTH - 1; i >= 0; i--) {
      initialSnake.push({ x: i, y: 0 });
    }
    setSnake(initialSnake);
    generateFood(initialSnake);
  }, []);

  const generateFood = (snakeBody: Point[]) => {
    let newFood: Point;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (snakeBody.some(seg => seg.x === newFood.x && seg.y === newFood.y));
    setFood(newFood);
  };

  return (
    <div className="text-center mt-10 space-y-6 font-sans">
      <h2 className="text-2xl font-bold text-black uppercase tracking-wide">
        🎮 Game Time!
      </h2>
      <h1 className="text-5xl font-black text-green-600 animate-bounce">
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
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const isSnake = snake.some((s) => s.x === x && s.y === y);
            const isFood = food.x === x && food.y === y;
            return (
              <div
                key={`${x}-${y}`}
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
    </div>
  );
}
