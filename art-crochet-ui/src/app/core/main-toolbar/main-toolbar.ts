import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-main-toolbar',
  imports: [MatToolbarModule, MatButtonModule],
  templateUrl: './main-toolbar.html',
  styleUrl: './main-toolbar.scss',
})
export class MainToolbar {
  title = 'Xima Art';
}
