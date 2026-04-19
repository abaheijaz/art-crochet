import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-mini-tote-bag',
  imports: [MatChipsModule, MatIconModule],
  templateUrl: './mini-tote-bag.html',
  styleUrl: './mini-tote-bag.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MiniToteBag {}
