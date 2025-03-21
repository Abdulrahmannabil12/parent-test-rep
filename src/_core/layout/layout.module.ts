import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { ContentComponent } from './components/content/content.component';
import { FooterComponent } from './components/footer/footer.component';

import { Routing } from 'app/pages/routing';
import { BrowserModule } from '@angular/platform-browser';
import { HeaderComponent } from './components/header/header.component';
import { NavbarComponent } from './components/header/navbar/navbar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToolbarComponent } from './components/header/toolbar/toolbar.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: Routing,
  },
];

@NgModule({
  declarations: [
    LayoutComponent,
    HeaderComponent,
    ContentComponent,
    FooterComponent,
    NavbarComponent,
    ToolbarComponent
  ],
  imports: [

    CommonModule,
    RouterModule.forChild(routes),
    NgbModule,
  ],
  exports: [RouterModule],
})
export class LayoutModule {}
