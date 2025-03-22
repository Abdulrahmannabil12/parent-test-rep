export const per_pages = [3, 5, 10, 15, 50, 100];

export interface IPaginatorState {
  page: number;
  per_page: number;
  total_pages: number;
  recalculatePaginator(total_pages: number): IPaginatorState;
}

export class PaginatorState implements IPaginatorState {
  page:number = 1;
  per_page = per_pages[2];
  total_pages = 0;
  per_pages: number[] = [];

  recalculatePaginator(total_pages: number): PaginatorState {
    this.total_pages = total_pages;
    return this;
  }
}

export interface IPaginatorView {
  paginator: PaginatorState;
  ngOnInit(): void;
  paginate(paginator: PaginatorState): void;
}
