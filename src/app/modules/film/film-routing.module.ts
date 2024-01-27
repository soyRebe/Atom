import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {FilmComponent} from "./components/film/film.component";
import {FilmDetalleComponent} from "./components/film-detalle/film-detalle.component";


const routes: Routes = [
  {
    path: '', component: FilmComponent
  },
  {
    path: 'film-detalle/:idimdbID', component: FilmDetalleComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FilmRoutingModule { }
