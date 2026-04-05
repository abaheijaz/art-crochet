import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainToolbar } from './core/main-toolbar/main-toolbar';

@Component({
  selector: 'app-root',
  imports: [MainToolbar],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App {}
