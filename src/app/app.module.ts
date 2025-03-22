import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';


import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ToastrModule } from 'ngx-toastr';



@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
      easeTime: 300,
      timeOut: 5000,
      closeButton: true,
      progressBar: true,
      titleClass: 'toast-titleClass',
      messageClass: 'toast-messageClass',
      toastClass: 'ngx-toastr',
    }),
    NgbModule,
  ],


  bootstrap: [AppComponent],
})
export class AppModule { }
