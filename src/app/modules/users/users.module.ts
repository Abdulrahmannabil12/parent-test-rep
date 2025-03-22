import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users.component';
import { UserRoutingModule } from './users-routing.module';
import { DynamicContainerModule } from '../dynamic-container/dynamic-container.module';
import { UsersListComponent } from './users-list/users-list.component';
import { AddEditUserComponent } from './users-list/components/add-edit-user/add-edit-user.component';
import { NgbDatepickerModule ,NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomToolBarActions } from './users-list/components/toolbarCustom.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    UsersComponent,
    UsersListComponent,
    AddEditUserComponent,
    CustomToolBarActions
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    DynamicContainerModule,
    NgbModule,
    NgbDatepickerModule,
    ReactiveFormsModule
  ],
})
export class UserModule {

}
