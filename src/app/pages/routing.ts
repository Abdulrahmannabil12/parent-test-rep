import { Routes } from '@angular/router';
import { HomeComponent } from 'app/modules/home/home.component';

const Routing: Routes = [
  {
    path: '',
    children: [
      {
        path: 'home',
        component:HomeComponent
      },


      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'  // Change to 'full' for an exact match
      },
    ]
  }, 


];


export { Routing };
