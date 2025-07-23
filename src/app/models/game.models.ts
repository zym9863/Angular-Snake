export interface Position {
  x: number;
  y: number;
}

export interface Snake {
  body: Position[];
  direction: Direction;
}

export interface Food {
  position: Position;
}

export interface GameConfig {
  boardWidth: number;
  boardHeight: number;
  cellSize: number;
  gameSpeed: number;
}

export interface GameStats {
  score: number;
  highScore: number;
  level: number;
}

export enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT'
}

export enum GameState {
  READY = 'READY',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  GAME_OVER = 'GAME_OVER'
}

export interface GameData {
  snake: Snake;
  food: Food;
  gameState: GameState;
  stats: GameStats;
  config: GameConfig;
}