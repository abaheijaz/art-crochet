import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'my-story',
    loadChildren: () =>
      import('./features/my-story/my-story.routes').then((module) => module.MY_STORY_ROUTES),
  },
  {
    path: 'details',
    title: 'Crochet Details | Made By Xima',
    data: {
      description:
        'Browse sizes, materials, stitch notes, and ordering details for Made By Xima handmade crochet pieces.',
    },
    loadComponent: () =>
      import('./features/details/components/details/details').then((module) => module.Details),
  },
  {
    path: 'details/:productType',
    title: 'Crochet Details | Made By Xima',
    data: {
      description:
        'Browse sizes, materials, stitch notes, and ordering details for Made By Xima handmade crochet pieces.',
    },
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
