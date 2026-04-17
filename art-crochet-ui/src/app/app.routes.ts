import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'my-story',
    loadChildren: () =>
      import('./features/my-story/my-story.routes').then((module) => module.MY_STORY_ROUTES),
  },
  {
    path: 'details',
    loadComponent: () =>
      import('./features/details/components/details/details').then((module) => module.Details),
  },
  {
    path: 'details/:productType',
    loadComponent: () =>
      import('./features/details/components/details/details').then((module) => module.Details),
  },
  {
    path: '',
    loadChildren: () =>
      import('./features/gallery/gallery.routes').then((module) => module.GALLERY_ROUTES),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
