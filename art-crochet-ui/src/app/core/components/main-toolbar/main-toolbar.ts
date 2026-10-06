import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-main-toolbar',
  imports: [MatToolbarModule, MatIconButton, MatIconModule, MatTooltipModule],
  templateUrl: './main-toolbar.html',
  styleUrl: './main-toolbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainToolbar {
  title = 'Lovingly Made';

  protected readonly themeService = inject(ThemeService);
}
