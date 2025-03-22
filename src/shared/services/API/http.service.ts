import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable, of } from 'rxjs';
 // import { Urls } from 'src/app/shared/model/api/urls';
const API_USERS_URL = `${environment.apiUrl}/Account`;

@Injectable({
  providedIn: 'root',
})
export class AuthHttpService {
  // incase the url need to call from json file in asset folder
  // protected domain = AppConfig.settings.apiServer;
  private domain = environment.apiUrl;
  constructor(public http: HttpClient) {
    // this.url = new Urls();
  }

  get<T>(url: string): Observable<T> {
    return this.http.get<T>(`${this.domain}/${url}`);
  }

  getById<T>(url: string): Observable<T> {
    return this.http.get<T>(`${this.domain}/${url}`);
  }

  post<T>(url: string, item: T): Observable<any> {
    return this.http.post(`${this.domain}/${url}`, item);
  }

  put<T>(url: string, item: any): Observable<T> {
    return this.http.put<T>(`${this.domain}/${url}`, item);
  }

  delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(`${this.domain}/${url}`);
  }
  auhturize(token: string): Observable<any> {
    if (!token) {
      return of(undefined)
    }
    return this.http.post<any>(`${API_USERS_URL}/Authorize`,
      JSON.stringify(token)
    );
  }

}
