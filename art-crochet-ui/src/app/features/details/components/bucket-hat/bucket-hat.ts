import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-bucket-hat',
  imports: [MatIconModule],
  templateUrl: './bucket-hat.html',
  styleUrl: './bucket-hat.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BucketHat {
  readonly variants = input<readonly string[]>([]);
}
