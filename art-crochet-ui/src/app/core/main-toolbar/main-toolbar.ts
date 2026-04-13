import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-main-toolbar',
  imports: [MatButtonModule, MatToolbarModule, RouterLink, RouterLinkActive],
  templateUrl: './main-toolbar.html',
  styleUrl: './main-toolbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainToolbar {
  title = 'Handmade by Xima';
}
