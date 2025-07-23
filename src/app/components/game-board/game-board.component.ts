import { Component, ElementRef, ViewChild, OnInit, OnDestroy, input, effect } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GameData, Position } from '../../models/game.models';

@Component({
  selector: 'app-game-board',
  standalone: true,
  template: `
    <div class="game-board-container">
      <canvas 
        #gameCanvas
        [width]="canvasWidth()"
        [height]="canvasHeight()"
        class="game-canvas"
      ></canvas>
    </div>
  `,
  styles: [`
    .game-board-container {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }

    .game-canvas {
      border: 3px solid #ffffff;
      border-radius: 10px;
      background-color: #1a1a2e;
      display: block;
      box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.5);
    }

    @media (max-width: 768px) {
      .game-board-container {
        padding: 10px;
      }
      
      .game-canvas {
        border-width: 2px;
      }
    }
  `]
})
export class GameBoardComponent implements OnInit, OnDestroy {
  @ViewChild('gameCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  
  // 接收游戏数据
  gameData = input.required<GameData>();
  
  private destroy$ = new Subject<void>();
  private ctx!: CanvasRenderingContext2D;
  
  // 颜色配置
  private readonly colors = {
    snake: '#4ade80',      // 蛇身体颜色 - 绿色
    snakeHead: '#22c55e',  // 蛇头颜色 - 深绿色
    food: '#ef4444',       // 食物颜色 - 红色
    background: '#1a1a2e', // 背景颜色 - 深蓝
    grid: '#16213e'        // 网格颜色 - 稍亮的深蓝
  };

  constructor() {
    // 监听游戏数据变化并重新渲染
    effect(() => {
      const data = this.gameData();
      if (data && this.ctx) {
        this.render();
      }
    });
  }

  // 计算画布尺寸
  canvasWidth = () => {
    const config = this.gameData().config;
    return config.boardWidth * config.cellSize;
  };

  canvasHeight = () => {
    const config = this.gameData().config;
    return config.boardHeight * config.cellSize;
  };

  ngOnInit(): void {
    this.initializeCanvas();
    this.startRenderLoop();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    
    if (!this.ctx) {
      console.error('无法获取Canvas上下文');
      return;
    }

    // 设置画布样式
    this.ctx.imageSmoothingEnabled = false;
  }

  private startRenderLoop(): void {
    // 监听游戏数据变化并重新渲染
    setTimeout(() => this.render());
  }

  private render(): void {
    if (!this.ctx) return;

    const data = this.gameData();
    const { config, snake, food } = data;

    // 清空画布并绘制背景
    this.clearCanvas();
    this.drawGrid();
    this.drawFood(food.position, config.cellSize);
    this.drawSnake(snake.body, config.cellSize);
  }

  private clearCanvas(): void {
    const { boardWidth, boardHeight, cellSize } = this.gameData().config;
    
    this.ctx.fillStyle = this.colors.background;
    this.ctx.fillRect(0, 0, boardWidth * cellSize, boardHeight * cellSize);
  }

  private drawGrid(): void {
    const { boardWidth, boardHeight, cellSize } = this.gameData().config;
    
    this.ctx.strokeStyle = this.colors.grid;
    this.ctx.lineWidth = 1;

    // 绘制垂直线
    for (let x = 0; x <= boardWidth; x++) {
      this.ctx.beginPath();
      this.ctx.moveTo(x * cellSize, 0);
      this.ctx.lineTo(x * cellSize, boardHeight * cellSize);
      this.ctx.stroke();
    }

    // 绘制水平线
    for (let y = 0; y <= boardHeight; y++) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y * cellSize);
      this.ctx.lineTo(boardWidth * cellSize, y * cellSize);
      this.ctx.stroke();
    }
  }

  private drawSnake(body: Position[], cellSize: number): void {
    body.forEach((segment, index) => {
      // 蛇头使用不同颜色
      this.ctx.fillStyle = index === 0 ? this.colors.snakeHead : this.colors.snake;
      
      const x = segment.x * cellSize;
      const y = segment.y * cellSize;
      
      // 绘制圆角矩形
      this.drawRoundedRect(x + 1, y + 1, cellSize - 2, cellSize - 2, 4);
      
      // 蛇头添加眼睛
      if (index === 0) {
        this.drawSnakeEyes(x, y, cellSize);
      }
    });
  }

  private drawSnakeEyes(x: number, y: number, cellSize: number): void {
    this.ctx.fillStyle = '#ffffff';
    const eyeSize = cellSize * 0.15;
    const eyeOffset = cellSize * 0.25;
    
    // 左眼
    this.ctx.beginPath();
    this.ctx.arc(
      x + eyeOffset, 
      y + eyeOffset, 
      eyeSize, 
      0, 
      2 * Math.PI
    );
    this.ctx.fill();
    
    // 右眼
    this.ctx.beginPath();
    this.ctx.arc(
      x + cellSize - eyeOffset, 
      y + eyeOffset, 
      eyeSize, 
      0, 
      2 * Math.PI
    );
    this.ctx.fill();
  }

  private drawFood(position: Position, cellSize: number): void {
    this.ctx.fillStyle = this.colors.food;
    
    const x = position.x * cellSize;
    const y = position.y * cellSize;
    const centerX = x + cellSize / 2;
    const centerY = y + cellSize / 2;
    const radius = cellSize * 0.4;
    
    // 绘制食物（圆形）
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    this.ctx.fill();
    
    // 添加高光效果
    this.ctx.fillStyle = '#ffffff';
    this.ctx.beginPath();
    this.ctx.arc(centerX - radius * 0.3, centerY - radius * 0.3, radius * 0.3, 0, 2 * Math.PI);
    this.ctx.fill();
  }

  private drawRoundedRect(x: number, y: number, width: number, height: number, radius: number): void {
    this.ctx.beginPath();
    this.ctx.moveTo(x + radius, y);
    this.ctx.lineTo(x + width - radius, y);
    this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    this.ctx.lineTo(x + width, y + height - radius);
    this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    this.ctx.lineTo(x + radius, y + height);
    this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    this.ctx.lineTo(x, y + radius);
    this.ctx.quadraticCurveTo(x, y, x + radius, y);
    this.ctx.closePath();
    this.ctx.fill();
  }
}