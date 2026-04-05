import { Component, signal } from '@angular/core';
import { MainToolbar } from './core/main-toolbar/main-toolbar';
import { Dashboard } from './features/dashboard/components/dashboard/dashboard';

@Component({
  selector: 'app-root',
  imports: [MainToolbar, Dashboard],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App {}
