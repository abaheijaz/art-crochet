import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { MainToolbar } from './core/main-toolbar/main-toolbar';

@Component({
  selector: 'app-root',
  imports: [MainToolbar, RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
