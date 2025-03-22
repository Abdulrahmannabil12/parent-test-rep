import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { PageInfoService } from 'shared/services/page-info.service';
import { CustomToolBarActions } from './components/toolbarCustom.component';
import { UserModel } from '../models/user.model';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
  standalone: false
})
export class UsersListComponent implements OnInit {
  constructor(public userService: UserService, private pageInfo: PageInfoService) { }
  modalState$: BehaviorSubject<{ isOpened: boolean, isEdit: boolean, user: UserModel }> = new BehaviorSubject({ isOpened: false, isEdit: false, user: new UserModel() });

  ngOnInit(): void {
    this.pageInfo.setBreadcrumbs([
      {
        title: 'Home',
        path: '/home',
        isActive: false,
      },
      {
        title: 'Dashboard',
        path: '/users',
        isActive: true,
      },
    ]);
    this.pageInfo.setTitle("User List");
    this.pageInfo.setComponent(CustomToolBarActions);

  }
  onEditUser(event: { isEdit: boolean; isShow: boolean; item: UserModel }) {
    this.pageInfo.updateComponentDataSubject({
      isOpened: true,
      user: event.item,
      isEdit: event.isEdit
    })
  }
  ngOnDestroy(): void {
    this.pageInfo.setComponent(null);

  }

}
