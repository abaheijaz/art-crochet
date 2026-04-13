import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Introduction } from './core/components/introduction/introduction';
import { MainToolbar } from './core/components/main-toolbar/main-toolbar';
import { Navigation } from './core/components/navigation/navigation';

@Component({
  selector: 'app-root',
  imports: [MainToolbar, Introduction, Navigation, RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
