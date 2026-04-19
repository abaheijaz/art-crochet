import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-mini-tote-bag',
  imports: [MatIconModule],
  templateUrl: './mini-tote-bag.html',
  styleUrl: './mini-tote-bag.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MiniToteBag {
  readonly variants = input<readonly string[]>([]);
}
