import { Component, signal } from '@angular/core';
import { SnakeGameComponent } from './components/snake-game/snake-game.component';

@Component({
  selector: 'app-root',
  imports: [SnakeGameComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Angular-Snake');
}
