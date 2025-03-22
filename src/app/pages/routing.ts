import { Routes, CanActivate } from '@angular/router';
import { AuthGuard } from 'app/modules/auth/services/guards/auth.guard';
import { HomeComponent } from 'app/modules/home/home.component';

const Routing: Routes = [

  {
    path:'auth',
    loadChildren: () =>
      import('../modules/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    children: [

      {
        path: 'users',
        loadChildren: () =>
          import('../modules/users/users.module').then((m) => m.UserModule),
      },

      {
        path: '',
        redirectTo: 'users',
        pathMatch: 'full'  // Change to 'full' for an exact match
      },
    ]
  },


  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'  // Change to 'full' for an exact match
  },
];


export { Routing };
