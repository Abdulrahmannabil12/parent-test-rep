import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersComponent } from './users.component';
import { UsersListComponent } from './users-list/users-list.component';


const routes: Routes = [
  {
    path: '',
    component: UsersComponent,
    children: [
      {
        path: "users-list",
        component: UsersListComponent
      },
      {
        path: '',
        redirectTo: 'users-list',
        pathMatch: 'full'  // Change to 'full' for an exact match
      },
    ]

  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {

}
