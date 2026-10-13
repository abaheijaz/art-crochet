import { Routes } from '@angular/router';

export const CONTACT_ROUTES: Routes = [
  {
    path: '',
    title: 'Contact | Made By Xima',
    data: {
      description: 'Get in touch with Made By Xima.',
    },
    loadComponent: () =>
      import('./components/contact/contact').then((module) => module.Contact),
  },
];
