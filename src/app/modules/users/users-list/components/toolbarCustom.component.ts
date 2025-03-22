import { AfterViewInit, Component, Input, OnDestroy, OnInit, signal, WritableSignal } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { PageInfoService } from "shared/services/page-info.service";
import { UserModel } from "../../models/user.model";

@Component({
  selector: 'app-custom-toolbar-action',
  standalone: false,
  template: `
   <ng-container>
     <button class="btn btn-primary primary-nav-btn fw-semibold px-5 fs-4" (click)="createNewUser()">
        <i class="fa fa-plus" aria-hidden="true"></i> New User
      </button>
      <app-add-edit-user [modalState]="modalState$"></app-add-edit-user>

   </ng-container>

      `,


})

export class CustomToolBarActions implements OnInit, AfterViewInit, OnDestroy {

  constructor(

    private pageInfo: PageInfoService,


  ) { }
  modalState$: BehaviorSubject<{ isOpened: boolean, isEdit: boolean, user: UserModel }> = new BehaviorSubject({ isOpened: false, isEdit: false, user: new UserModel() });
  ngOnInit(): void {
    this.pageInfo.componentDataObservable.subscribe(res => {

      if (res&&res.isOpened) {
        this.modalState$.next({ isOpened: true, isEdit: true, user: res.user })

      }
    })
  }
  ngAfterViewInit(): void {



  }
  createNewUser() {
    this.modalState$.next({ isOpened: true, isEdit: false, user: new UserModel() })
  }
  ngOnDestroy(): void {
 
  }



}
