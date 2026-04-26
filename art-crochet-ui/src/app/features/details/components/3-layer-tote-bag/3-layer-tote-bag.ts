import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-three-layer-tote-bag',
  imports: [MatIconModule],
  templateUrl: './3-layer-tote-bag.html',
  styleUrl: './3-layer-tote-bag.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThreeLayerToteBag {
  readonly variants = input<readonly string[]>([]);
}
