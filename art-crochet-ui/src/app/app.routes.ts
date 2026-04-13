import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'my-story',
    loadChildren: () =>
      import('./features/my-story/my-story.routes').then((module) => module.MY_STORY_ROUTES),
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
