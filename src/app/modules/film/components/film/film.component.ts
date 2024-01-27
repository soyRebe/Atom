import {Component, OnInit} from '@angular/core';
import {OmdbService} from "../../../../services/omdb.service";
import {Film} from "../../../../interfaces/film";
import {JsonPipe} from "@angular/common";
import {AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgbPagination} from "@ng-bootstrap/ng-bootstrap";
import {ActivatedRoute, ParamMap, Router, RouterLink} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-film',
  standalone: true,
  imports: [
    JsonPipe,
    ReactiveFormsModule,
    NgbPagination,
    RouterLink
  ],
  templateUrl: './film.component.html',
  styleUrl: './film.component.scss'
})
export class FilmComponent implements OnInit {
  subscription: Subscription | undefined;

  film: Film | undefined;
  types: string[] = ['movie', 'series', 'episode'];

  filter: FormGroup = new FormGroup<any>({});

  loading: boolean = false;

  test: { Search: any[]; totalResults: string; Response: string; } | undefined;

  page: number = 1;
  pageSize: number = 10;
  collectionSize: number = 0;

  params: any = { page: 1 };

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

  sendParams(): void {
    this.router.navigate(['/film'], {
      queryParams: this.params
    }).then( () => {} );
  }

  search(): void {
    this.loading = true;

    const title: string = this.filter.get('title')?.value;
    const type: string = this.filter.get('type')?.value;
    const year: string = this.filter.get('year')?.value;

    this.params.page = 1;
    this.params['title'] = title;
    this.params['type'] = type;
    this.params['year'] = year;

    this.sendParams();
  }

  list(): void {
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

        this.omdbService.list( title, type, year, this.params.page ).subscribe({
          next: (response: { Search: any[]; totalResults: string; Response: string; }) => {
            this.test = response;
            this.loading = false;
            this.collectionSize = Number( response.totalResults || 0 );
          }
        });
      }
    });
  }

  get fFilter(): { [key: string]: AbstractControl } {
    return this.filter.controls;
  }


}

