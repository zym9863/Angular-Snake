import { Injectable, signal, computed } from '@angular/core';
import { BehaviorSubject, interval, Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { Direction, GameState, Position, Snake, Food, GameData, GameStats, GameConfig } from '../models/game.models';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private destroy$ = new Subject<void>();
  private gameLoopSubscription?: any;

  // 游戏配置
  private readonly defaultConfig: GameConfig = {
    boardWidth: 20,
    boardHeight: 20,
    cellSize: 20,
    gameSpeed: 200
  };

  // 游戏状态信号
  public readonly gameState = signal<GameState>(GameState.READY);
  public readonly snake = signal<Snake>({
    body: [{ x: 10, y: 10 }],
    direction: Direction.RIGHT
  });
  public readonly food = signal<Food>({
    position: { x: 15, y: 15 }
  });
  public readonly stats = signal<GameStats>({
    score: 0,
    highScore: this.getHighScore(),
    level: 1
  });
  public readonly config = signal<GameConfig>(this.defaultConfig);

  // 计算属性
  public readonly canStartGame = computed(() => 
    this.gameState() === GameState.READY || this.gameState() === GameState.GAME_OVER
  );
  public readonly canPauseGame = computed(() => 
    this.gameState() === GameState.PLAYING
  );
  public readonly canResumeGame = computed(() => 
    this.gameState() === GameState.PAUSED
  );

  // 游戏数据流
  private gameDataSubject = new BehaviorSubject<GameData>(this.getCurrentGameData());
  public gameData$ = this.gameDataSubject.asObservable();

  constructor() {
    this.generateFood();
  }

  // 开始游戏
  startGame(): void {
    if (!this.canStartGame()) return;
    
    this.initializeGame();
    this.gameState.set(GameState.PLAYING);
    this.startGameLoop();
    this.emitGameData();
  }

  // 暂停游戏
  pauseGame(): void {
    if (!this.canPauseGame()) return;
    
    this.gameState.set(GameState.PAUSED);
    this.stopGameLoop();
    this.emitGameData();
  }

  // 恢复游戏
  resumeGame(): void {
    if (!this.canResumeGame()) return;
    
    this.gameState.set(GameState.PLAYING);
    this.startGameLoop();
    this.emitGameData();
  }

  // 重启游戏
  restartGame(): void {
    this.stopGameLoop();
    this.initializeGame();
    this.gameState.set(GameState.READY);
    this.emitGameData();
  }

  // 改变蛇的方向
  changeDirection(direction: Direction): void {
    if (this.gameState() !== GameState.PLAYING) return;
    
    const currentDirection = this.snake().direction;
    
    // 防止蛇反向移动
    if (this.isOppositeDirection(currentDirection, direction)) return;
    
    this.snake.update(snake => ({ ...snake, direction }));
    this.emitGameData();
  }

  // 私有方法：初始化游戏
  private initializeGame(): void {
    const centerX = Math.floor(this.config().boardWidth / 2);
    const centerY = Math.floor(this.config().boardHeight / 2);
    
    this.snake.set({
      body: [{ x: centerX, y: centerY }],
      direction: Direction.RIGHT
    });
    
    this.stats.update(stats => ({ ...stats, score: 0, level: 1 }));
    this.generateFood();
  }

  // 私有方法：开始游戏循环
  private startGameLoop(): void {
    this.stopGameLoop();
    
    const speed = Math.max(100, this.config().gameSpeed - (this.stats().level - 1) * 20);
    
    this.gameLoopSubscription = interval(speed)
      .pipe(
        takeUntil(this.destroy$),
        filter(() => this.gameState() === GameState.PLAYING)
      )
      .subscribe(() => {
        this.updateGame();
      });
  }

  // 私有方法：停止游戏循环
  private stopGameLoop(): void {
    if (this.gameLoopSubscription) {
      this.gameLoopSubscription.unsubscribe();
      this.gameLoopSubscription = null;
    }
  }

  // 私有方法：更新游戏状态
  private updateGame(): void {
    const currentSnake = this.snake();
    const newHead = this.getNextHeadPosition(currentSnake);
    
    // 检查碰撞
    if (this.checkCollision(newHead, currentSnake.body)) {
      this.gameOver();
      return;
    }
    
    const newBody = [newHead, ...currentSnake.body];
    
    // 检查是否吃到食物
    if (this.checkFoodCollision(newHead)) {
      this.eatFood();
    } else {
      newBody.pop(); // 移除尾部
    }
    
    this.snake.update(snake => ({ ...snake, body: newBody }));
    this.emitGameData();
  }

  // 私有方法：获取下一个头部位置
  private getNextHeadPosition(snake: Snake): Position {
    const head = snake.body[0];
    const config = this.config();
    
    switch (snake.direction) {
      case Direction.UP:
        return { x: head.x, y: head.y - 1 };
      case Direction.DOWN:
        return { x: head.x, y: head.y + 1 };
      case Direction.LEFT:
        return { x: head.x - 1, y: head.y };
      case Direction.RIGHT:
        return { x: head.x + 1, y: head.y };
    }
  }

  // 私有方法：检查碰撞
  private checkCollision(position: Position, snakeBody: Position[]): boolean {
    const config = this.config();
    
    // 检查墙壁碰撞
    if (position.x < 0 || position.x >= config.boardWidth || 
        position.y < 0 || position.y >= config.boardHeight) {
      return true;
    }
    
    // 检查自身碰撞
    return snakeBody.some(segment => 
      segment.x === position.x && segment.y === position.y
    );
  }

  // 私有方法：检查食物碰撞
  private checkFoodCollision(position: Position): boolean {
    const foodPos = this.food().position;
    return position.x === foodPos.x && position.y === foodPos.y;
  }

  // 私有方法：吃食物
  private eatFood(): void {
    const currentStats = this.stats();
    const newScore = currentStats.score + 10;
    const newLevel = Math.floor(newScore / 100) + 1;
    
    this.stats.update(stats => ({
      ...stats,
      score: newScore,
      level: newLevel,
      highScore: Math.max(stats.highScore, newScore)
    }));
    
    this.generateFood();
    this.saveHighScore();
    
    // 如果等级提升，重新启动游戏循环以调整速度
    if (newLevel > currentStats.level) {
      this.startGameLoop();
    }
  }

  // 私有方法：生成食物
  private generateFood(): void {
    const config = this.config();
    const snakeBody = this.snake().body;
    let newFoodPosition: Position;
    
    do {
      newFoodPosition = {
        x: Math.floor(Math.random() * config.boardWidth),
        y: Math.floor(Math.random() * config.boardHeight)
      };
    } while (snakeBody.some(segment => 
      segment.x === newFoodPosition.x && segment.y === newFoodPosition.y
    ));
    
    this.food.set({ position: newFoodPosition });
  }

  // 私有方法：游戏结束
  private gameOver(): void {
    this.stopGameLoop();
    this.gameState.set(GameState.GAME_OVER);
    this.saveHighScore();
    this.emitGameData();
  }

  // 私有方法：检查方向是否相反
  private isOppositeDirection(current: Direction, target: Direction): boolean {
    const opposites = {
      [Direction.UP]: Direction.DOWN,
      [Direction.DOWN]: Direction.UP,
      [Direction.LEFT]: Direction.RIGHT,
      [Direction.RIGHT]: Direction.LEFT
    };
    
    return opposites[current] === target;
  }

  // 私有方法：获取当前游戏数据
  private getCurrentGameData(): GameData {
    return {
      snake: this.snake(),
      food: this.food(),
      gameState: this.gameState(),
      stats: this.stats(),
      config: this.config()
    };
  }

  // 私有方法：发射游戏数据
  private emitGameData(): void {
    this.gameDataSubject.next(this.getCurrentGameData());
  }

  // 私有方法：获取最高分
  private getHighScore(): number {
    const saved = localStorage.getItem('snake-high-score');
    return saved ? parseInt(saved, 10) : 0;
  }

  // 私有方法：保存最高分
  private saveHighScore(): void {
    localStorage.setItem('snake-high-score', this.stats().highScore.toString());
  }

  // 清理资源
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.stopGameLoop();
  }
}