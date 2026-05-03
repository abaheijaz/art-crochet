import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-diamond-tote-bag',
  imports: [MatIconModule],
  templateUrl: './diamond-tote-bag.html',
  styleUrl: './diamond-tote-bag.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiamondToteBag {
  readonly variants = input<readonly string[]>([]);
}
