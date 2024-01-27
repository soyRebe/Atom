import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '', loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule)
  },
  {
    path:'film', loadChildren:()=>import('./modules/film/film.module').then(m => m.FilmModule)
  }
];
