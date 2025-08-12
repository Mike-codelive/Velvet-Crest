import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'VelvetCrest - Home',
  },
  {
    path: 'search',
    loadComponent: () =>
      import('./search/search.component').then((m) => m.SearchComponent),
    title: 'VelvetCrest - Search',
  },
  {
    path: 'product/:id',
    loadComponent: () =>
      import('./product-details/product-details.component').then(
        (m) => m.ProductDetailsComponent
      ),
    title: 'VelvetCrest - Product Details',
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
