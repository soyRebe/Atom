import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class OmdbService {
  private url: string = 'https://www.omdbapi.com/?apikey=1c57ab32';

  constructor(private http: HttpClient) { }

  list( title: string, type?: string, year?: string, page?: string ): Observable<any> {
    // Todo: Agregar metodo para buscar
    //https://www.omdbapi.com/?apikey=351f3428&s=water&page=2.

    let params: string = 's=' + title;

    if ( type ) {
      params += '&type=' + type;
    }

    if ( year ) {
      params += '&y=' + year;
    }

    if ( page ) {
      params += '&page=' + page;
    }

    const url: string = this.url + '&' + params;
    return this.http.get(url);
  }

  getFilm( id: string ): Observable<any> {
    const url: string = this.url + '&i=' + id;
    return this.http.get(url);
  }


}
