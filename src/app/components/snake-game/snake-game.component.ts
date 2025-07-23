import { Component, OnInit, OnDestroy, signal, effect } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

import { GameService } from '../../services/game.service';
import { KeyboardService } from '../../services/keyboard.service';
import { GameBoardComponent } from '../game-board/game-board.component';
import { ScoreboardComponent } from '../scoreboard/scoreboard.component';
import { GameControlsComponent } from '../game-controls/game-controls.component';
import { GameData, Direction } from '../../models/game.models';

@Component({
  selector: 'app-snake-game',
  standalone: true,
  imports: [
    CommonModule,
    GameBoardComponent,
    ScoreboardComponent,
    GameControlsComponent
  ],
  template: `
    <div class="snake-game-container">
      <div class="game-header">
        <h1 class="game-title">
          <span class="title-icon">🐍</span>
          贪吃蛇游戏
          <span class="title-icon">🍎</span>
        </h1>
        <div class="game-subtitle">使用方向键或WASD移动，收集食物成长！</div>
      </div>

      <div class="game-content">
        <div class="game-main">
          @if (gameData()) {
            <app-game-board 
              [gameData]="gameData()!"
              class="game-board-wrapper"
            />
          }
          
          <app-game-controls
            [gameState]="gameData()!.gameState"
            (startGame)="handleStartGame()"
            (pauseGame)="handlePauseGame()"
            (resumeGame)="handleResumeGame()"
            (restartGame)="handleRestartGame()"
            (directionChange)="handleDirectionChange($event)"
            class="controls-wrapper"
          />
        </div>

        <div class="game-sidebar">
          @if (gameData()) {
            <app-scoreboard
              [stats]="gameData()!.stats"
              [gameState]="gameData()!.gameState"
            />
          }
        </div>
      </div>

      <div class="game-footer">
        <div class="footer-content">
          <div class="tips">
            <div class="tip-title">💡 游戏提示</div>
            <ul class="tip-list">
              <li>收集红色食物来增加分数和长度</li>
              <li>避免撞到墙壁或自己的身体</li>
              <li>每100分提升一个等级，游戏速度会加快</li>
              <li>你的最高分会自动保存</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .snake-game-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
      color: white;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      padding: 20px;
      display: flex;
      flex-direction: column;
    }

    .game-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .game-title {
      font-size: 3rem;
      font-weight: bold;
      margin: 0 0 10px 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 15px;
    }

    .title-icon {
      font-size: 2.5rem;
      animation: bounce 2s infinite;
    }

    @keyframes bounce {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-10px);
      }
    }

    .game-subtitle {
      font-size: 1.1rem;
      opacity: 0.8;
      color: #a0aec0;
    }

    .game-content {
      display: grid;
      grid-template-columns: 1fr 320px;
      gap: 30px;
      flex: 1;
      align-items: start;
    }

    .game-main {
      display: flex;
      flex-direction: column;
      gap: 20px;
      align-items: center;
    }

    .game-board-wrapper {
      flex-shrink: 0;
    }

    .controls-wrapper {
      width: 100%;
      max-width: 600px;
    }

    .game-sidebar {
      position: sticky;
      top: 20px;
    }

    .game-footer {
      margin-top: 30px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding-top: 20px;
    }

    .footer-content {
      max-width: 800px;
      margin: 0 auto;
    }

    .tips {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 15px;
      padding: 20px;
      backdrop-filter: blur(10px);
    }

    .tip-title {
      font-size: 1.2rem;
      font-weight: bold;
      margin-bottom: 15px;
      color: #ffd700;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .tip-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .tip-list li {
      padding: 8px 0;
      padding-left: 20px;
      position: relative;
      color: #cbd5e0;
      line-height: 1.5;
    }

    .tip-list li::before {
      content: '▶';
      position: absolute;
      left: 0;
      color: #4ade80;
      font-size: 0.8rem;
    }

    /* 响应式设计 */
    @media (max-width: 1200px) {
      .game-content {
        grid-template-columns: 1fr 280px;
        gap: 20px;
      }
    }

    @media (max-width: 992px) {
      .game-content {
        grid-template-columns: 1fr;
        gap: 20px;
      }

      .game-sidebar {
        position: static;
        order: -1;
      }

      .snake-game-container {
        padding: 15px;
      }
    }

    @media (max-width: 768px) {
      .game-title {
        font-size: 2.2rem;
        flex-direction: column;
        gap: 10px;
      }

      .title-icon {
        font-size: 2rem;
      }

      .game-subtitle {
        font-size: 1rem;
      }

      .snake-game-container {
        padding: 10px;
      }

      .game-header {
        margin-bottom: 20px;
      }

      .tips {
        padding: 15px;
      }

      .tip-title {
        font-size: 1.1rem;
      }
    }

    @media (max-width: 480px) {
      .game-title {
        font-size: 1.8rem;
      }

      .title-icon {
        font-size: 1.5rem;
      }
    }

    /* 加载动画 */
    .loading {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 300px;
      font-size: 1.2rem;
      color: #a0aec0;
    }

    /* 聚焦时的样式 */
    .snake-game-container:focus-within .game-board-wrapper {
      transform: scale(1.02);
      transition: transform 0.3s ease;
    }
  `]
})
export class SnakeGameComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  // 游戏数据信号
  gameData = signal<GameData | null>(null);

  constructor(
    private gameService: GameService,
    private keyboardService: KeyboardService
  ) {
    // 监听游戏数据变化
    effect(() => {
      // 当gameData发生变化时，这里可以添加副作用逻辑
      const data = this.gameData();
      if (data) {
        // 可以在这里添加音效、振动等效果
        // console.log('游戏状态:', data.gameState, '分数:', data.stats.score);
      }
    });
  }

  ngOnInit(): void {
    this.initializeGame();
    this.setupKeyboardListeners();
    this.setupGameDataSubscription();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeGame(): void {
    // 游戏服务已经在构造函数中初始化了默认状态
    // 这里可以添加额外的初始化逻辑
  }

  private setupKeyboardListeners(): void {
    // 监听方向键输入
    this.keyboardService.direction$
      .pipe(takeUntil(this.destroy$))
      .subscribe(direction => {
        this.gameService.changeDirection(direction);
      });

    // 监听游戏控制键输入
    this.keyboardService.gameAction$
      .pipe(takeUntil(this.destroy$))
      .subscribe(action => {
        switch (action) {
          case 'start':
            this.handleStartGame();
            break;
          case 'pause':
            this.handleTogglePause();
            break;
          case 'restart':
            this.handleRestartGame();
            break;
        }
      });
  }

  private setupGameDataSubscription(): void {
    // 订阅游戏数据流
    this.gameService.gameData$
      .pipe(takeUntil(this.destroy$))
      .subscribe(gameData => {
        this.gameData.set(gameData);
      });
  }

  // 游戏控制方法
  handleStartGame(): void {
    this.gameService.startGame();
  }

  handlePauseGame(): void {
    this.gameService.pauseGame();
  }

  handleResumeGame(): void {
    this.gameService.resumeGame();
  }

  handleRestartGame(): void {
    this.gameService.restartGame();
  }

  handleDirectionChange(direction: string): void {
    // 将字符串转换为Direction枚举
    const directionMap: { [key: string]: Direction } = {
      'UP': Direction.UP,
      'DOWN': Direction.DOWN,
      'LEFT': Direction.LEFT,
      'RIGHT': Direction.RIGHT
    };

    const directionEnum = directionMap[direction];
    if (directionEnum) {
      this.gameService.changeDirection(directionEnum);
    }
  }

  private handleTogglePause(): void {
    const currentState = this.gameData()?.gameState;
    if (this.gameService.canPauseGame()) {
      this.handlePauseGame();
    } else if (this.gameService.canResumeGame()) {
      this.handleResumeGame();
    }
  }
}