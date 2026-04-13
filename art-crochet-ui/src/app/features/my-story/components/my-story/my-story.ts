import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-my-story',
  imports: [MatCardModule, RouterLink, RouterLinkActive],
  templateUrl: './my-story.html',
  styleUrl: './my-story.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyStory {}
