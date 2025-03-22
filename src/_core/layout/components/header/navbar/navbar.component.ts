import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BaseAuthService } from 'shared/services/auth/base.auth.service';
import { SessionService } from 'shared/services/LocalStorage/session.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: false

})
export class NavbarComponent implements OnInit {


  isCollapsed: boolean;
  isLoggedIn$:Observable<Boolean>;
  constructor(private auth: BaseAuthService, private router: Router) {
    this.isCollapsed = true;
  }

  ngOnInit() {

    this.isLoggedIn$ = this.auth.currentLoggedIn;
  }
  logOut() {

    this.auth.logOut();
    window.location.reload()
  }
  redirectLogin(){
    this.router.navigate(['auth/login']);
  }
  collapseNavMenu() {

    this.isCollapsed = !this.isCollapsed;

  }

}
