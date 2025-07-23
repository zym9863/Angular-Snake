# Angular Snake Game / Angular 贪吃蛇游戏

**语言 / Language:** [中文](README.md) | [English](README_EN.md)

一个使用 Angular 20.1.0 构建的现代贪吃蛇游戏，采用独立组件、信号（Signals）和响应式编程模式。

A modern Snake game built with Angular 20.1.0, featuring standalone components, signals, and reactive programming patterns.

## 功能特性 / Features

- 🎮 **现代 Angular 架构** - 使用独立组件和 Angular Signals
- 📱 **响应式设计** - 支持桌面和移动设备
- ⌨️ **多种控制方式** - 键盘 (方向键/WASD) 和触摸控制
- 🏆 **分数系统** - 实时分数追踪和最高分记录
- 🎯 **渐进难度** - 随等级提升游戏速度
- 🎨 **现代 UI** - 深色主题，渐变效果和动画
- 💾 **数据持久化** - 最高分本地存储
- 🌐 **中文界面** - 完整的中文本地化

## 项目结构 / Project Structure

```
src/
├── app/
│   ├── components/          # 游戏组件
│   │   ├── snake-game/      # 主游戏容器组件
│   │   ├── game-board/      # Canvas 游戏画板
│   │   ├── game-controls/   # 游戏控制按钮
│   │   └── scoreboard/      # 分数显示面板
│   ├── models/              # 数据模型和接口
│   │   └── game.models.ts   # 游戏状态、蛇、食物等模型
│   ├── services/            # 业务逻辑服务
│   │   ├── game.service.ts  # 核心游戏逻辑
│   │   └── keyboard.service.ts # 键盘输入处理
│   ├── app.config.ts        # 应用配置
│   └── app.routes.ts        # 路由配置
└── styles.scss              # 全局样式
```

## 技术栈 / Tech Stack

- **Angular** 20.1.0 - 前端框架
- **TypeScript** 5.8.2 - 类型安全
- **RxJS** 7.8.0 - 响应式编程
- **SCSS** - 样式预处理器
- **HTML5 Canvas** - 游戏渲染

## 开始使用 / Getting Started

### 环境要求 / Prerequisites

- Node.js 18+ 
- Angular CLI 20.1.1+

### 安装依赖 / Installation

```bash
npm install
```

### 开发服务器 / Development Server

```bash
ng serve
```

访问 `http://localhost:4200/` 查看游戏。文件修改后会自动重新加载。

### 构建项目 / Build

```bash
ng build
```

构建文件将输出到 `dist/` 目录。

## 游戏控制 / Game Controls

### 键盘控制 / Keyboard Controls
- **方向键 / WASD** - 控制蛇的移动方向
- **空格键 / ESC** - 暂停/继续游戏
- **Enter** - 开始游戏
- **R** - 重新开始

### 移动端控制 / Mobile Controls
- **方向按钮** - 屏幕上的触摸控制
- **控制按钮** - 开始/暂停/重启

## 核心特性实现 / Core Features

### 游戏状态管理
- 使用 Angular Signals 进行响应式状态管理
- RxJS 实现游戏循环和事件处理

### 碰撞检测
- 墙壁碰撞检测
- 蛇身自碰撞检测
- 食物碰撞检测

### 渲染系统
- HTML5 Canvas 高效渲染
- 网格布局系统
- 蛇头眼睛和食物高亮效果

### 响应式设计
- 移动优先的 CSS 设计
- 触摸友好的控制界面
- 自适应画布尺寸

## 开发说明 / Development

本项目采用现代 Angular 开发模式：

- **独立组件** - 无需 NgModule
- **信号系统** - 替代传统的 Subject/Observable 模式
- **输入/输出装饰器** - 使用新语法
- **类型安全** - 完整的 TypeScript 类型定义

## 许可证 / License

MIT License

## 贡献 / Contributing

欢迎提交 Issue 和 Pull Request 来改进这个项目。
