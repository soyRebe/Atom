import { Component, OnInit } from '@angular/core';
import {JsonPipe, Location} from '@angular/common';
import { ActivatedRoute, RouterLink } from "@angular/router";
import { OmdbService } from "../../../../services/omdb.service";
import { Film } from "../../../../interfaces/film";

@Component({
  selector: 'app-film-detalle',
  standalone: true,
  imports: [
    RouterLink,
    JsonPipe
  ],
  templateUrl: './film-detalle.component.html',
  styleUrl: './film-detalle.component.scss'
})
export class FilmDetalleComponent implements OnInit {
  film: Film | undefined;
  loading: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private omdbService: OmdbService,
    private location: Location
  ) { }

  ngOnInit(): void {
   this.loading = true;
    const idimdbID: string = this.route.snapshot.paramMap.get('idimdbID') || '';
    if ( idimdbID ) {
      this.omdbService.getFilm( idimdbID ).subscribe({
        next: ( response: Film ) => {
          this.film = response;
          this.loading = false;
        }
      });
    }
  }

  back(): void {
    this.location.back();
  }
}
