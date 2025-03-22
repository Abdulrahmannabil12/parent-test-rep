import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { PaginatorState, per_pages } from 'shared/model/paginator.model';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
  encapsulation:ViewEncapsulation.None,
  standalone:false
})
export class PaginatorComponent implements OnInit {
  @Input() paginator: PaginatorState;
  @Input() isLoading:any;
  @Output() paginate: EventEmitter<PaginatorState> = new EventEmitter();
  pageSizes: number[] = per_pages;
  constructor() {}

  ngOnInit(): void {
  }


  pageChange(num: number) {
    this.paginator.page = num;
    this.paginate.emit(this.paginator);
  }

  sizeChange() {
    this.paginator.per_page = +this.paginator.per_page;
    this.paginator.page = 1;
    this.paginate.emit(this.paginator);
  }
}
