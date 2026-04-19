import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-phone-bag',
  imports: [MatChipsModule, MatIconModule],
  templateUrl: './phone-bag.html',
  styleUrl: './phone-bag.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneBag {}
