import { Routes } from '@angular/router';

export const MY_STORY_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/my-story/my-story').then((module) => module.MyStory),
  },
];
