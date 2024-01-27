import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {OmdbService} from "../../../../services/omdb.service";
import {Film} from "../../../../interfaces/film";

@Component({
  selector: 'app-film-detalle',
  standalone: true,
  imports: [],
  templateUrl: './film-detalle.component.html',
  styleUrl: './film-detalle.component.scss'
})
export class FilmDetalleComponent implements OnInit {
  film: Film | undefined;
  constructor(
    private route: ActivatedRoute,
    private omdbService: OmdbService
  ) { }

  ngOnInit(): void {
    const idimdbID: string = this.route.snapshot.paramMap.get('idimdbID') || '';

    if ( idimdbID ) {
      this.omdbService.getFilm( idimdbID ).subscribe({
        next: ( response: Film ) => {
          this.film = response;
        }
      });
    }
  }
}
