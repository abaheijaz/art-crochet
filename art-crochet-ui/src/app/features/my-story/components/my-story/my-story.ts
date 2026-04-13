import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-my-story',
  imports: [MatCardModule],
  templateUrl: './my-story.html',
  styleUrl: './my-story.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyStory {}
