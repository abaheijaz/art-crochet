import { Routes } from '@angular/router';

export const GALLERY_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/gallery/gallery').then((module) => module.Gallery),
  },
];
