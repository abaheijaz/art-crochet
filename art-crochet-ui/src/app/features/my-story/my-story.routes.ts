import { Routes } from '@angular/router';

export const MY_STORY_ROUTES: Routes = [
  {
    path: '',
    title: 'My Story | Made By Xima',
    data: {
      description:
        'Read the story behind Made By Xima and the crochet journey that shaped each handmade piece.',
    },
    loadComponent: () => import('./components/my-story/my-story').then((module) => module.MyStory),
  },
];
