import { Component, input, output } from '@angular/core';
import { GameState } from '../../models/game.models';

@Component({
  selector: 'app-game-controls',
  standalone: true,
  template: `
    <div class="game-controls">
      <div class="control-buttons">
        @if (canStart()) {
          <button 
            class="control-btn start-btn"
            (click)="onStart()"
            title="开始游戏 (回车键)"
          >
            <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18c.62-.39.62-1.29 0-1.68L9.54 5.98C8.87 5.55 8 6.03 8 6.82z"/>
            </svg>
            开始游戏
          </button>
        }

        @if (canPause()) {
          <button 
            class="control-btn pause-btn"
            (click)="onPause()"
            title="暂停游戏 (空格键)"
          >
            <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
            </svg>
            暂停
          </button>
        }

        @if (canResume()) {
          <button 
            class="control-btn resume-btn"
            (click)="onResume()"
            title="继续游戏 (空格键)"
          >
            <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18c.62-.39.62-1.29 0-1.68L9.54 5.98C8.87 5.55 8 6.03 8 6.82z"/>
            </svg>
            继续
          </button>
        }

        <button 
          class="control-btn restart-btn"
          (click)="onRestart()"
          title="重新开始游戏 (R键)"
        >
          <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
          </svg>
          重新开始
        </button>
      </div>

      @if (gameState() === GameState.GAME_OVER) {
        <div class="game-over-message">
          <div class="game-over-title">游戏结束!</div>
          <div class="game-over-subtitle">按 R 键或点击重新开始继续游戏</div>
        </div>
      }

      <div class="mobile-controls">
        <div class="mobile-title">移动控制 (移动设备)</div>
        <div class="direction-pad">
          <button 
            class="direction-btn up"
            (click)="onDirectionClick('UP')"
            title="向上移动"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14l-6-6z"/>
            </svg>
          </button>
          
          <div class="middle-row">
            <button 
              class="direction-btn left"
              (click)="onDirectionClick('LEFT')"
              title="向左移动"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12l4.58-4.59z"/>
              </svg>
            </button>
            
            <div class="center-space"></div>
            
            <button 
              class="direction-btn right"
              (click)="onDirectionClick('RIGHT')"
              title="向右移动"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
              </svg>
            </button>
          </div>
          
          <button 
            class="direction-btn down"
            (click)="onDirectionClick('DOWN')"
            title="向下移动"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6-1.41-1.41z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .game-controls {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .control-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      justify-content: center;
    }

    .control-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      border: none;
      border-radius: 25px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      min-width: 120px;
      justify-content: center;
    }

    .control-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
    }

    .control-btn:active {
      transform: translateY(0);
    }

    .btn-icon {
      width: 18px;
      height: 18px;
    }

    .start-btn {
      background: linear-gradient(135deg, #48bb78, #38a169);
      color: white;
    }

    .start-btn:hover {
      background: linear-gradient(135deg, #38a169, #2f855a);
    }

    .pause-btn {
      background: linear-gradient(135deg, #ed8936, #dd6b20);
      color: white;
    }

    .pause-btn:hover {
      background: linear-gradient(135deg, #dd6b20, #c05621);
    }

    .resume-btn {
      background: linear-gradient(135deg, #4299e1, #3182ce);
      color: white;
    }

    .resume-btn:hover {
      background: linear-gradient(135deg, #3182ce, #2c5aa0);
    }

    .restart-btn {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
    }

    .restart-btn:hover {
      background: linear-gradient(135deg, #764ba2, #5a67d8);
    }

    .game-over-message {
      text-align: center;
      padding: 20px;
      background: linear-gradient(135deg, #f56565, #e53e3e);
      border-radius: 15px;
      color: white;
      box-shadow: 0 8px 25px rgba(245, 101, 101, 0.3);
      animation: gameOverPulse 2s infinite;
    }

    @keyframes gameOverPulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.02);
      }
    }

    .game-over-title {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .game-over-subtitle {
      font-size: 14px;
      opacity: 0.9;
    }

    .mobile-controls {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 15px;
      padding: 20px;
      text-align: center;
    }

    .mobile-title {
      font-size: 14px;
      font-weight: 600;
      color: #a0aec0;
      margin-bottom: 15px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .direction-pad {
      display: grid;
      grid-template-rows: auto auto auto;
      gap: 8px;
      max-width: 150px;
      margin: 0 auto;
    }

    .middle-row {
      display: grid;
      grid-template-columns: auto 1fr auto;
      gap: 8px;
      align-items: center;
    }

    .center-space {
      width: 50px;
      height: 50px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 50%;
      border: 2px dashed rgba(255, 255, 255, 0.2);
    }

    .direction-btn {
      width: 50px;
      height: 50px;
      border: none;
      border-radius: 50%;
      background: linear-gradient(135deg, #4a5568, #2d3748);
      color: white;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    }

    .direction-btn:hover {
      background: linear-gradient(135deg, #667eea, #764ba2);
      transform: scale(1.1);
    }

    .direction-btn:active {
      transform: scale(0.95);
    }

    .direction-btn svg {
      width: 24px;
      height: 24px;
    }

    .up {
      justify-self: center;
    }

    .down {
      justify-self: center;
    }

    @media (max-width: 768px) {
      .control-buttons {
        flex-direction: column;
        align-items: center;
      }

      .control-btn {
        min-width: 200px;
      }

      .mobile-controls {
        display: block;
      }

      .game-over-title {
        font-size: 20px;
      }
    }

    @media (min-width: 769px) {
      .mobile-controls {
        display: none;
      }
    }
  `]
})
export class GameControlsComponent {
  gameState = input.required<GameState>();

  // 输出事件
  startGame = output<void>();
  pauseGame = output<void>();
  resumeGame = output<void>();
  restartGame = output<void>();
  directionChange = output<string>();

  // 获取游戏状态枚举
  readonly GameState = GameState;

  canStart(): boolean {
    return this.gameState() === GameState.READY || this.gameState() === GameState.GAME_OVER;
  }

  canPause(): boolean {
    return this.gameState() === GameState.PLAYING;
  }

  canResume(): boolean {
    return this.gameState() === GameState.PAUSED;
  }

  onStart(): void {
    this.startGame.emit();
  }

  onPause(): void {
    this.pauseGame.emit();
  }

  onResume(): void {
    this.resumeGame.emit();
  }

  onRestart(): void {
    this.restartGame.emit();
  }

  onDirectionClick(direction: string): void {
    if (this.gameState() === GameState.PLAYING) {
      this.directionChange.emit(direction);
    }
  }
}