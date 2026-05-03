import { Routes } from '@angular/router';

export const GALLERY_ROUTES: Routes = [
  {
    path: '',
    title: 'Made By Xima',
    data: {
      description: 'Handmade crochet pieces, stories, and inspiration from Made By Xima.',
    },
    loadComponent: () => import('./components/gallery/gallery').then((module) => module.Gallery),
  },
];
