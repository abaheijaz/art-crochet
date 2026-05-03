import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-oreo-bag',
  imports: [MatIconModule],
  templateUrl: './oreo-bag.html',
  styleUrl: './oreo-bag.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OreoBag {
  readonly variants = input<readonly string[]>([]);
}
