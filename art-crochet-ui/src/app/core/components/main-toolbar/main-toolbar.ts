import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-main-toolbar',
  imports: [MatToolbarModule, RouterLink],
  templateUrl: './main-toolbar.html',
  styleUrl: './main-toolbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainToolbar {
  title = 'Lovingly Made';
}
