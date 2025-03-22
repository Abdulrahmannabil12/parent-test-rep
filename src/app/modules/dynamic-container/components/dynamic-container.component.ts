import {
  Component,
  Input,
  EventEmitter,
  Output, OnDestroy,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { DynamicDialogComponent } from './dynamic-dialog/dynamic-dialog.component';
import { Router } from '@angular/router';

import { catchError, debounceTime, map } from 'rxjs/operators';
import { BaseTableService } from 'shared/services/base.table.service';
import { PaginatorState } from 'shared/model/paginator.model';
@Component({
  selector: 'app-dynamic-container',
  templateUrl: './dynamic-container.component.html',
  styleUrls: ['./dynamic-container.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false
})

export class DynamicContainerComponent<T> implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('tableScroll') TableScroll: ElementRef;
  @Input()
  PageTitle = '';
  @Input()
  service: BaseTableService<any> = {} as BaseTableService<any>;

  @Input()
  isEditable = false;
  @Input()
  isDeletable = false;
  @Input()
  isViewable = false;


  @Input()
  columns: { header: string; field: string, type?: string, width?: number, image?: string, dataSourceApi?: string, keyExpr?: string, valueExpr?: string, dataSourceEnum?: any }[] = [];

  @Output() openDialog: EventEmitter<{ isEdit: boolean; isShow: boolean; item: T }> = new EventEmitter();

  @Output() onView: EventEmitter<{ item: T }> = new EventEmitter();

  @Output() onDelete: EventEmitter<{ isDeleted: Boolean }> = new EventEmitter();

  @Output() deleteEventEmitter: EventEmitter<any> = new EventEmitter();

  @Input()
  routerLinkRoute = '';
  @Input()
  routerLinkParam: string | Array<string>;
  dataSource = [] as T[];
  paginator: PaginatorState = {} as PaginatorState;
  isLoading?: boolean;
  private subscriptions: Subscription[] = [];
  get serviceIsNotEmpty(): boolean {
    return this.service && Object.keys(this.service).length > 0;
  }
  constructor(private fb: FormBuilder, private modalService: NgbModal, private router: Router) { }

  ngOnInit(): void {
    if (this.serviceIsNotEmpty) {
      this.service.fetch();
      this.paginator = this.service.paginator;
      const sb = this.service.isLoading$.subscribe(
        (res: boolean | undefined) => (this.isLoading = res)
      );
      this.columns = this.service.getTableHeaderAndFields();
    }
  }

  ngAfterViewInit() {
  }

  View(item: T) {

    this.onView.emit({ item });
  }

  getItemField(item: any, field: string) {


    if (field.includes('&')) {
      const itemArr = field.split("&");
      return item[itemArr[0]] + ' ' + item[itemArr[1]]

    } else {
      return item[field]
    }

  }

  // pagination
  paginate(pagination: PaginatorState) {

    this.service.patchState({ pagination });
  }

  ngOnDestroy() {
    this.service.setDefaults()
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  deleteItem(id: number) {
    const modalRef = this.modalService.open(DynamicDialogComponent);
    modalRef.componentInstance.id = id;
    this.setDefaultValues(modalRef);
    modalRef.result.then(
      (result) => {
        this.onDelete.emit({ isDeleted: result })
        this.service.fetch()
      },
      () => {  }
    );
  }




  openAddEditDialog(isEdit = false, item: T): void {
    console.log(item)

    this.openDialog.emit({ isEdit, isShow: false, item });
  }



  private setDefaultValues(modalRef: any): void {
    modalRef.componentInstance.title = this.PageTitle;
    modalRef.componentInstance.service = this.service;
  }
}
