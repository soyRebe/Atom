import {Component, OnInit} from '@angular/core';
import {OmdbService} from "../../../../services/omdb.service";
import {Film} from "../../../../interfaces/film";
import {JsonPipe} from "@angular/common";
import {AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgbPagination} from "@ng-bootstrap/ng-bootstrap";
import {ActivatedRoute, ParamMap, Router, RouterLink} from "@angular/router";
import {filter, Subscription} from "rxjs";
import {LabelTypePipe} from "../../../../pipes/label-type.pipe";
import {types} from "../../../../config";

@Component({
  selector: 'app-film',
  standalone: true,
  imports: [
    JsonPipe,
    ReactiveFormsModule,
    NgbPagination,
    RouterLink,
    LabelTypePipe
  ],
  templateUrl: './film.component.html',
  styleUrl: './film.component.scss'
})
export class FilmComponent implements OnInit {
  subscription: Subscription | undefined;
  film: Film | undefined;
  types: { value: string, label: string }[] = types;
  filter: FormGroup = new FormGroup<any>({});
  loading: boolean = false;
  searchFilm: { Search: any[]; totalResults: string; Response: string; } | undefined;
  page: number = 1;
  pageSize: number = 10;
  collectionSize: number = 0;
  params: any = { page: 1 };
  message: string = 'No hay resultados para mostrar';

  constructor(
    private omdbService: OmdbService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.filter = this.fb.group({
      title: ['',[Validators.required]],
      type: ['',[]],
      year: ['',[
        Validators.pattern(/^[0-9]\d*$/),
        Validators.min(1900),
        Validators.max(new Date().getFullYear())
      ]]
    })
  }

  ngOnInit(){
    this.list();
  }

  onPageChange(event: any): void {
    this.params.page = event;
    this.page = event;
    this.sendParams();
  }

  private sendParams(): void {
    this.router.navigate(['/film'], {
      queryParams: this.params
    }).then( () => {} );
  }

  search(): void {
    this.loading = true;
    this.setParamsFromFilter();
    this.sendParams();
  }

  reset(): void {
    this.filter.get('title')?.reset();
    this.filter.get('type')?.reset();
    this.filter.get('year')?.reset();
    this.setParamsFromFilter();
    this.sendParams();
  }

  private setParamsFromFilter(): void {
    const title: string = this.filter.get('title')?.value;
    const type: string = this.filter.get('type')?.value;
    const year: string = this.filter.get('year')?.value;

    this.params.page = 1;
    this.params['title'] = title;
    this.params['type'] = type;
    this.params['year'] = year;
  }

  private list(): void {
    this.message = '';
    this.subscription = this.route.queryParamMap.subscribe({
      next: (paramsAsMap: ParamMap) => {
        this.params.page = paramsAsMap.get('page') || 1;
        this.page = this.params.page;

        const title: string = paramsAsMap.get('title') || '';
        const type: string = paramsAsMap.get('type') || '';
        const year: string  = paramsAsMap.get('year') || '';

        if ( title ) {
          this.params.title = title;
          this.filter.get('title')?.setValue(title);
        }

        if ( type ) {
          this.params.type = type;
          this.filter.get('type')?.setValue(type);
        }

        if ( year ) {
          this.params.year = year;
          this.filter.get('year')?.setValue(year);
        }

        this.searchFilm = undefined;

        if ( this.filter.valid && this.fFilter['title'].valid ) {
          this.loading = true;
          this.omdbService.list(title, type, year, this.params.page).subscribe({
            next: (response: { Search: any[]; totalResults: string; Response: string; Error?: string }) => {
              if (response.Response === 'True') {
                this.searchFilm = response;
                this.loading = false;
                this.collectionSize = Number(response.totalResults || 0);
              } else {
                this.loading = false;
                if ( response.Error ) {
                  this.message = response.Error;
                }
              }
            },
            error: () => {
              this.loading = false;
            }
          });
        } else {
          this.message = 'Ingrese un texto en el campo "T\u00edtulo" para iniciar la b\u00fasqueda.';
        }
      }
    });
  }

  get fFilter(): { [key: string]: AbstractControl } {
    return this.filter.controls;
  }
}
