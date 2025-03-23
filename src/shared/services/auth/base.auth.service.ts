import { jwtDecode } from 'jwt-decode';
import { HttpClient} from '@angular/common/http';
import {Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

import { catchError, finalize, map, switchMap } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { AuthHttpService } from '../API/http.service';
import { SessionService } from '../LocalStorage/session.service';


@Injectable({
  providedIn: 'root',
})
export class BaseAuthService extends AuthHttpService {
  private isLoggedSource = new BehaviorSubject<boolean>(false);
  currentLoggedIn = this.isLoggedSource.asObservable();
  private loginUrl = `${environment.apiUrl}/login`;
  urls = [
    'users',
  ];
  isLoadingSubject: BehaviorSubject<boolean>;
  currentUserSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  get isLoading$() {
    return this.isLoadingSubject.asObservable();
  }
  get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  set currentUserValue(user: any) {
    this.currentUserSubject.next(user);
  }
  constructor(http: HttpClient, private sessionService: SessionService, private authHttpService: AuthHttpService,) {
    super(http);
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoggedSource.next(!!this.sessionService.getToken());

  }

  public LoginUser(
    email: string,
    password: string,
  ): Observable<{
    token: string;

  }> {
    this.isLoadingSubject.next(true);
    return this.http.post<{
      token: string;
      email: string;
    } | null>(this.loginUrl, { email, password }).pipe(
      map((res: any) => {
        const auth: { token: string } = { ...res, email }
        this.isLoggedSource.next(!!auth);
        return this.setAuthFromLocalStorage(auth) ? auth : null;

      }),

      catchError((err) => {
        console.error('err', err);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
  // private methods
  private setAuthFromLocalStorage(data: any): boolean {
    // store auth token/refreshToken/epiresIn in local storage to keep user logged in between page refreshes

    if (data && data.token) {
      this.isLoadingSubject.next(true);
      this.sessionService.setToken(data.token);
      this.sessionService.setUserData(data);
      return true;
    }
    return false;
  }
  public isLogin(): boolean {

    return !!this.sessionService.getToken();
  }
  public logOut(): void {
    this.sessionService.clearAll();
    this.isLoggedSource.next(false);

    // this.currentUserSubject.next(false);
  }
  public isAuthenticatedUrl(fullurl: string): boolean {
    // return true;
    return this.urls.some(
      (method) => fullurl.toLowerCase().indexOf(method.toLowerCase()) > -1
    );
  }

  public validToken(): boolean {
    const token = this.sessionService.getToken();
    const decodedToken = jwtDecode(token)
    const expirationTime = decodedToken.exp;
    const currentTime = Math.floor(Date.now() / 1000);

    return currentTime >= expirationTime;
  }



}
