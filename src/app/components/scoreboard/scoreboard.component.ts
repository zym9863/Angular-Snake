import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStats, GameState } from '../../models/game.models';

@Component({
  selector: 'app-scoreboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="scoreboard">
      <div class="score-section">
        <div class="score-item current-score">
          <span class="score-label">当前分数</span>
          <span class="score-value">{{ stats().score }}</span>
        </div>
        
        <div class="score-item high-score">
          <span class="score-label">最高分数</span>
          <span class="score-value">{{ stats().highScore }}</span>
        </div>
        
        <div class="score-item level">
          <span class="score-label">当前等级</span>
          <span class="score-value">{{ stats().level }}</span>
        </div>
      </div>
      
      <div class="game-status" [ngClass]="getStatusClass()">
        <span class="status-text">{{ getStatusText() }}</span>
        @if (showPulse()) {
          <div class="pulse-indicator"></div>
        }
      </div>
      
      <div class="instructions">
        <div class="instruction-title">操作说明</div>
        <div class="instruction-grid">
          <div class="instruction-item">
            <span class="key-combo">↑↓←→</span>
            <span class="key-desc">移动</span>
          </div>
          <div class="instruction-item">
            <span class="key-combo">WASD</span>
            <span class="key-desc">移动</span>
          </div>
          <div class="instruction-item">
            <span class="key-combo">空格</span>
            <span class="key-desc">暂停</span>
          </div>
          <div class="instruction-item">
            <span class="key-combo">回车</span>
            <span class="key-desc">开始</span>
          </div>
          <div class="instruction-item">
            <span class="key-combo">R</span>
            <span class="key-desc">重启</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .scoreboard {
      background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
      border-radius: 15px;
      padding: 20px;
      color: white;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
      min-width: 280px;
    }

    .score-section {
      display: flex;
      flex-direction: column;
      gap: 15px;
      margin-bottom: 25px;
    }

    .score-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
    }

    .score-item:hover {
      background: rgba(255, 255, 255, 0.15);
      transform: translateY(-2px);
    }

    .current-score {
      border-left: 4px solid #48bb78;
    }

    .high-score {
      border-left: 4px solid #ed8936;
    }

    .level {
      border-left: 4px solid #667eea;
    }

    .score-label {
      font-size: 14px;
      font-weight: 500;
      opacity: 0.9;
    }

    .score-value {
      font-size: 20px;
      font-weight: bold;
      color: #ffd700;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    .game-status {
      text-align: center;
      padding: 15px;
      border-radius: 10px;
      margin-bottom: 25px;
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .game-status.ready {
      background: linear-gradient(135deg, #4299e1, #3182ce);
    }

    .game-status.playing {
      background: linear-gradient(135deg, #48bb78, #38a169);
    }

    .game-status.paused {
      background: linear-gradient(135deg, #ed8936, #dd6b20);
    }

    .game-status.game-over {
      background: linear-gradient(135deg, #f56565, #e53e3e);
    }

    .status-text {
      font-size: 16px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1px;
      position: relative;
      z-index: 2;
    }

    .pulse-indicator {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 20px;
      height: 20px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      transform: translate(-50%, -50%);
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0% {
        transform: translate(-50%, -50%) scale(0);
        opacity: 1;
      }
      100% {
        transform: translate(-50%, -50%) scale(4);
        opacity: 0;
      }
    }

    .instructions {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 10px;
      padding: 15px;
    }

    .instruction-title {
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 12px;
      text-align: center;
      color: #a0aec0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .instruction-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }

    .instruction-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 6px 10px;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.08);
      font-size: 12px;
    }

    .key-combo {
      background: rgba(255, 255, 255, 0.2);
      padding: 2px 6px;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
      font-weight: bold;
      font-size: 11px;
    }

    .key-desc {
      color: #cbd5e0;
      font-size: 11px;
    }

    @media (max-width: 768px) {
      .scoreboard {
        padding: 15px;
        min-width: 250px;
      }

      .score-item {
        padding: 10px 12px;
      }

      .score-value {
        font-size: 18px;
      }

      .game-status {
        padding: 12px;
      }

      .status-text {
        font-size: 14px;
      }

      .instruction-grid {
        grid-template-columns: 1fr;
        gap: 6px;
      }
    }
  `]
})
export class ScoreboardComponent {
  stats = input.required<GameStats>();
  gameState = input.required<GameState>();

  getStatusText(): string {
    switch (this.gameState()) {
      case GameState.READY:
        return '准备开始';
      case GameState.PLAYING:
        return '游戏进行中';
      case GameState.PAUSED:
        return '游戏暂停';
      case GameState.GAME_OVER:
        return '游戏结束';
      default:
        return '';
    }
  }

  getStatusClass(): string {
    switch (this.gameState()) {
      case GameState.READY:
        return 'ready';
      case GameState.PLAYING:
        return 'playing';
      case GameState.PAUSED:
        return 'paused';
      case GameState.GAME_OVER:
        return 'game-over';
      default:
        return '';
    }
  }

  showPulse(): boolean {
    return this.gameState() === GameState.PLAYING;
  }
}