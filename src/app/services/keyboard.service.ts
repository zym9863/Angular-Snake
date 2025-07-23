import { Injectable } from '@angular/core';
import { fromEvent, Observable, Subject } from 'rxjs';
import { filter, map, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Direction } from '../models/game.models';

@Injectable({
  providedIn: 'root'
})
export class KeyboardService {
  private destroy$ = new Subject<void>();
  private directionSubject = new Subject<Direction>();
  private gameActionSubject = new Subject<string>();

  // 方向键映射
  private directionKeyMap: { [key: string]: Direction } = {
    'ArrowUp': Direction.UP,
    'ArrowDown': Direction.DOWN,
    'ArrowLeft': Direction.LEFT,
    'ArrowRight': Direction.RIGHT,
    'w': Direction.UP,
    'W': Direction.UP,
    's': Direction.DOWN,
    'S': Direction.DOWN,
    'a': Direction.LEFT,
    'A': Direction.LEFT,
    'd': Direction.RIGHT,
    'D': Direction.RIGHT
  };

  // 游戏控制键映射
  private gameActionKeyMap: { [key: string]: string } = {
    ' ': 'pause',       // 空格键暂停/恢复
    'Space': 'pause',
    'Enter': 'start',   // 回车键开始
    'r': 'restart',     // R键重启
    'R': 'restart',
    'Escape': 'pause'   // ESC键暂停
  };

  // 公开的观察者
  public direction$ = this.directionSubject.asObservable();
  public gameAction$ = this.gameActionSubject.asObservable();

  constructor() {
    this.initializeKeyboardListeners();
  }

  // 初始化键盘监听器
  private initializeKeyboardListeners(): void {
    fromEvent<KeyboardEvent>(document, 'keydown')
      .pipe(
        takeUntil(this.destroy$),
        filter(event => !event.repeat), // 防止按键重复
        map(event => event.code || event.key)
      )
      .subscribe(key => {
        this.handleKeyPress(key);
      });
  }

  // 处理按键
  private handleKeyPress(key: string): void {
    // 检查是否是方向键
    if (this.directionKeyMap[key]) {
      this.directionSubject.next(this.directionKeyMap[key]);
      return;
    }

    // 检查是否是游戏控制键
    if (this.gameActionKeyMap[key]) {
      this.gameActionSubject.next(this.gameActionKeyMap[key]);
      return;
    }
  }

  // 启用键盘监听
  enableKeyboard(): void {
    // 键盘监听已在构造函数中启用，这里可以添加额外的启用逻辑
  }

  // 禁用键盘监听
  disableKeyboard(): void {
    // 这里可以添加禁用逻辑，但通常我们保持监听活跃
  }

  // 获取支持的按键说明
  getKeyboardInstructions(): { [action: string]: string[] } {
    return {
      '移动': ['方向键 ↑↓←→', 'WASD 键'],
      '开始游戏': ['回车键 Enter'],
      '暂停/恢复': ['空格键 Space', 'ESC 键'],
      '重启游戏': ['R 键']
    };
  }

  // 清理资源
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}