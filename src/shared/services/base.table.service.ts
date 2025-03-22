// tslint:disable:variable-name
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { catchError, finalize, map, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { ResponseData } from 'shared/model/response-data.model';
import { SessionService } from './LocalStorage/session.service';
import { NotificationService } from './notification/notification.service';
import { BaseModel } from 'shared/model/base.model';
import { PaginatorState } from 'shared/model/paginator.model';

interface ITableState<T> {

  pagination: PaginatorState;

}

const DEFAULT_STATE: ITableState<any> = {

  pagination: new PaginatorState(),

};
@Injectable({ providedIn: 'root' })
export abstract class BaseTableService<T> {
  // Private fields
  private _isFirstLoading$ = new BehaviorSubject<boolean>(true);
  protected _items$ = new BehaviorSubject<T[]>([]);
  protected _isLoading$ = new BehaviorSubject<boolean>(false);
  protected _tableState$ = new BehaviorSubject<ITableState<T>>(DEFAULT_STATE);
  protected _errorMessage = new BehaviorSubject<string>('');
  protected _subscriptions: Subscription[] = [];
  protected data: T[] = [];
  // Getters
  public get items$() {
    return this._items$.asObservable();
  }
  get isLoading$() {
    return this._isLoading$.asObservable();
  }
  get isFirstLoading$() {
    return this._isFirstLoading$.asObservable();
  }
  get errorMessage$() {
    return this._errorMessage.asObservable();
  }
  get subscriptions() {
    return this._subscriptions;
  }
  // State getters
  get paginator() {
    return this._tableState$.value.pagination;
  }


  http: HttpClient;
  protected notify: NotificationService;
  protected sessionService: SessionService;
  // API URL has to be override
  API_URL = environment.apiUrl;
  controller = '';
  Api = '';
  customFetchApi = '';

  constructor(http: HttpClient, notify: NotificationService, sessionService: SessionService) {
    this.http = http;
    this.notify = notify;
    this.sessionService = sessionService;
  }

  // CREATE
  // server should return the object with ID
  create(item: BaseModel): Observable<BaseModel> {
    this._isLoading$.next(true);
    this._errorMessage.next('');

    const url = `${this.API_URL}/${this.controller}/`;
    return this.http.post<BaseModel>(url, item).pipe(
      catchError((err) => {
        this._errorMessage.next(err);
        console.error('CREATE ITEM', err);
        return of({ id: undefined });
      }),
      finalize(() => {
        this._isLoading$.next(false);
        this.fetch();
      })
    );
  }
  public patchStateWithoutFetch(patch: Partial<ITableState<T>>) {

    const newState = Object.assign(this._tableState$.value, patch);
    this._tableState$.next(newState);

  }

  // Base Methods
  public patchState(patch: Partial<ITableState<T>>) {
    this.patchStateWithoutFetch(patch);
    this.fetch()
  }
  // READ (Returning filtered list of entities)
  find(tableState: ITableState<T>): Observable<ResponseData<T[]>> {
    let url = `${this.API_URL}/${this.controller}?`;

    return this.findByUrl(url, tableState);
  }
  protected findByUrl(url: string, tableState: ITableState<T>) {
    this._errorMessage.next('');
    const cTableState = toQueryParams(tableState.pagination);

    return this.http.get<ResponseData<T[]>>(url + cTableState).pipe(
      catchError((err) => {
        this._errorMessage.next(err);
        return of({ data: [], total: 0 } as ResponseData<T[]>);
      })
    );
  }
  getItemById(id: number): Observable<BaseModel> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const url = `${this.API_URL}/${this.controller}/GetById?Id=${id}`;
    return this.http.get<BaseModel>(url).pipe(
      catchError((err) => {
        this._errorMessage.next(err);
        return of({ id: undefined });
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }
  getById(obj: T, idField = 'id'): Observable<ResponseData<T>> {
    const item = (obj as any)[idField];
    return this.http.get<ResponseData<T>>(`${this.controller}/GetById/${item}`);
  }
  // UPDATE
  update(item: BaseModel,id:number): Observable<any> {
    const url = `${this.API_URL}/${this.controller}?id=${id}`;
    this._isLoading$.next(true);
    this._errorMessage.next('');
    return this.http.put(url, item).pipe(
      catchError((err) => {
        this._errorMessage.next(err);
        return of(item);
      }),
      finalize(() => {
        this._isLoading$.next(false);
        this.fetch();

      })
    );
  }

  // UPDATE Status
  updateStatusForItems(ids: number[], status: number): Observable<any> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const body = { ids, status };
    const url = this.API_URL + '/updateStatus';
    return this.http.put(url, body).pipe(
      catchError((err) => {
        this._errorMessage.next(err);
        console.error('UPDATE STATUS FOR SELECTED ITEMS', ids, status, err);
        return of([]);
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }

  // DELETE
  delete(id: any, controllerFun?: string): Observable<any> {
    this._isLoading$.next(true);
    this._errorMessage.next('');

    const url = `${this.API_URL}/${this.controller}?id=${id}`;

    return this.http.delete(url).pipe(
      catchError((err) => {
        this._errorMessage.next(err);
        console.error('DELETE ITEM', id, err);
        return of({});
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }

  // delete list of items
  deleteItems(ids: number[] = [], controllerFun?: string): Observable<any> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    controllerFun = controllerFun ? controllerFun : 'Delete'
    const url = `${this.API_URL}/${this.controller}/${controllerFun}`;
    return this.http.post(url, ids).pipe(
      catchError((err) => {
        this._errorMessage.next(err);
        console.error('DELETE SELECTED ITEMS', ids, err);
        return of([]);
      }),
      finalize(() => {
        this._isLoading$.next(false);
        this.fetch();
      })
    );
  }

  public fetch() {

    this._isLoading$.next(true);
    this._errorMessage.next('');
    const request = this.find(this._tableState$.value)
      .pipe(
        tap((res: any) => {
          this.data = res.data;
          this._items$.next(res.data);
          const total = res.total;
          this.patchStateWithoutFetch({
            pagination:
              this._tableState$.value.pagination.recalculatePaginator(
                total
              ),
          });
        }),
        catchError((err) => {
          this._errorMessage.next(err);
          return of({
            items: [],
            total: 0,
          });
        }),
        finalize(() => {
          this._isLoading$.next(false);

        })
      )
      .subscribe();
    this._subscriptions.push(request);
  }




  public setDefaults() {


    this.patchStateWithoutFetch({
      pagination: new PaginatorState(),
    });

    this._isLoading$.next(true);
    this._tableState$.next(DEFAULT_STATE);
    this._errorMessage.next('');
  }


  getTableHeaderAndFields(prop?: any): {
    header: string;
    field: string;
    type?: string;
    dataSourceApi?: string;
    keyExpr?: string;
    valueExpr?: string;

    dataSourceEnum?: Array<any>
  }[] {
    return [];
  }
  insert(item: T, controllerFunc?: string): Observable<T> {
    this._isLoading$.next(true);
    this._errorMessage.next('');

    const url = `${this.API_URL}/${this.controller}/${controllerFunc ? controllerFunc : "Create"}`;
    return this.http.post<T>(url, item).pipe(
      finalize(() => {
        this.fetch();
        this._isLoading$.next(false);
      })
    );
  }
}


function toQueryParams(obj) {
  const params = new URLSearchParams();

  for (const key in obj) {
    if (Array.isArray(obj[key])) {
      // Handle array values, making sure to represent empty arrays
      obj[key].forEach(value => params.append(key, value));
    } else {
      params.append(key, obj[key]);
    }
  }
  console.log(obj)
  return params.toString(); // returns query string
}
