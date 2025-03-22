import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { delay, tap, catchError, finalize } from 'rxjs/operators';
import { BaseTableService } from 'shared/services/base.table.service';
@Component({
  selector: 'app-dynamic-dialog',
  templateUrl: './dynamic-dialog.component.html',
  styleUrls: ['./dynamic-dialog.component.scss'],
  standalone: false

})
export class DynamicDialogComponent implements OnInit, OnDestroy {

  @Input()
  ids: number[] = [];

  @Input()
  id: number = null!;

  @Input()
  service: BaseTableService<any> = {} as BaseTableService<any>;

  @Input()
  title?: string;

  isLoading = false;
  subscriptions: Subscription[] = [];
  constructor(public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  deleteItem() {
    this.isLoading = true;
    this.deleteById();

  }
  private deleteById() {
    this.isLoading = true;
    const sb = this.service.delete(this.id).pipe(
      delay(1000), // Remove it from your code (just for showing loading)
      tap(() => this.modal.close(true)),
      catchError((err) => {
        this.modal.close(false);
        return of(undefined);
      }),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe();
    this.subscriptions.push(sb);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
