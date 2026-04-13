import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'about',
    loadChildren: () =>
      import('./features/about/about.routes').then((module) => module.ABOUT_ROUTES),
  },
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () =>
      import('./features/gallery/gallery.routes').then((module) => module.GALLERY_ROUTES),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
