import { AfterViewInit, Component, Input, OnDestroy, OnInit, signal, WritableSignal } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { PageInfoService } from "shared/services/page-info.service";
import { UserModel } from "../../models/user.model";
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-custom-toolbar-action',
  standalone: false,
  template: `
   <ng-container>
     <button class="btn btn-primary rounded-btn fw-semibold px-5 fs-4" (click)="createNewUser()">
        <i class="fa fa-plus" aria-hidden="true"></i> New User
      </button>
      <app-add-edit-user ></app-add-edit-user>

   </ng-container>

      `,


})

export class CustomToolBarActions implements OnInit, AfterViewInit, OnDestroy {

  constructor(

    private pageInfo: PageInfoService,
    private userService: UserService,


  ) { }
  ngOnInit(): void {
    this.pageInfo.componentDataObservable.subscribe(res => {

      if (res && res.isOpened) {
        this.userService.modalState$.next({ isOpened: true, isCreate: true, isEdit: true, isView: false, user: res.user })

      }
    })
  }
  ngAfterViewInit(): void {



  }
  createNewUser() {
    this.userService.modalState$.next({ isOpened: true, isCreate: true, isEdit: false, isView: false, user: new UserModel() })
  }
  ngOnDestroy(): void {
    this.userService.modalState$.next({ isOpened: false, isCreate: false, isEdit: false, isView: false, user: null })

  }



}
