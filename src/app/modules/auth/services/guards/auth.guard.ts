import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { BaseAuthService } from 'shared/services/auth/base.auth.service';
import { SessionService } from '../../../../../shared/services/LocalStorage/session.service';



@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: BaseAuthService, private sessionService: SessionService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    const token = this.sessionService.getToken();
    // this.authService.validToken(); // ! Important: provided token is not valid

    if (token) {
      return true;
    } else {
      this.authService.logOut();
      this.router.navigate(['auth/login'], {
        queryParams: { returnUrl: state.url },
      });
      return false;
    }


  }
}
