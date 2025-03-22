import { NgModule } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';

import { DynamicContainerComponent } from './components/dynamic-container.component';
import { NgbAlertModule, NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DynamicDialogComponent } from './components/dynamic-dialog/dynamic-dialog.component';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { NgPagination } from './components/paginator/ng-pagination/ng-pagination.component';

@NgModule({
  declarations: [DynamicContainerComponent, DynamicDialogComponent, NgPagination, PaginatorComponent],
  imports: [
    CommonModule, 
    HttpClientModule,
    ReactiveFormsModule,

    NgbModalModule,
  ],

  exports: [
    DynamicContainerComponent,
    DynamicDialogComponent
  ]
})
export class DynamicContainerModule { }
