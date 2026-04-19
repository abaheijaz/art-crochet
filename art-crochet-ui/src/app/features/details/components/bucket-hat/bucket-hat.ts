import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-bucket-hat',
  imports: [MatChipsModule, MatIconModule],
  templateUrl: './bucket-hat.html',
  styleUrl: './bucket-hat.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BucketHat {}
