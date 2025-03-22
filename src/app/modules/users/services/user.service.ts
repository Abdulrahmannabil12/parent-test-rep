import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { BaseTableService } from 'shared/services/base.table.service';
import { SessionService } from 'shared/services/LocalStorage/session.service';
import { NotificationService } from 'shared/services/notification/notification.service';
import { UserModel } from '../models/user.model';


@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseTableService<UserModel> {

  modalState$: BehaviorSubject<{ isOpened: boolean, isCreate: boolean,isEdit: boolean, isView: boolean, user: UserModel }> = new BehaviorSubject({ isOpened: false, isCreate: true, isEdit: false, isView: false, user: new UserModel() });

  url = '/';
  constructor(@Inject(HttpClient) http: HttpClient, notify: NotificationService, sessionService: SessionService) {
    super(http, notify, sessionService);
    this.controller = 'users';
  }

  override getTableHeaderAndFields() {
    return [
      { field: 'first_name&last_name', header: 'User', type: 'hasImage', image: 'avatar' },

    ];
  }



}

