
import { Component, effect, inject, Input, OnInit, signal, TemplateRef, ViewChild, WritableSignal, ViewEncapsulation } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, catchError, delay, finalize, of, Subscription, tap } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'shared/services/notification/notification.service';
import { UserModel } from 'app/modules/users/models/user.model';
import { UserService } from 'app/modules/users/services/user.service';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false
})
export class ViewUserComponent implements OnInit {
  @ViewChild('content') content: TemplateRef<any>;
  userData: UserModel;
  isLoading = false;
  subscriptions: Subscription[] = [];
  private modalService = inject(NgbModal);
  constructor(public formBuilder: FormBuilder,
    public userService: UserService) {

  }

  ngOnInit(): void {
    this.userService.modalState$.subscribe(res => {

      if (res.isOpened && res.isView && !this.modalService.hasOpenModals()) {
        this.userData = res.user;
        this.open();
      }
    })
  }







  open() {
    this.modalService.open(this.content, { windowClass: 'view-modal', size: 'lg' })
  }
  closeModal() {
    this.modalService.dismissAll()
  }

  editUser() {
    this.closeModal();
    setTimeout(() => {
      this.userService.modalState$.next({
        isOpened: true,
        isCreate: false,
        isView: false,
        user: this.userData,
        isEdit: true

      })
    }, 250)

  }
  deleteUser() {
    this.isLoading = true;
    this.isLoading = true;
    const sb = this.userService.delete(this.userData.id).pipe(
      delay(1000), // Remove it from your code (just for showing loading)
      tap(() => this.closeModal()),
      catchError((err) => {

        return of(undefined);
      }),
      finalize(() => {
        this.isLoading = false;
        this.modalService.dismissAll();

      })
    ).subscribe();
    this.subscriptions.push(sb);

  }
  ngOnDestroy(): void {
    this.modalService.dismissAll();
  }
}
