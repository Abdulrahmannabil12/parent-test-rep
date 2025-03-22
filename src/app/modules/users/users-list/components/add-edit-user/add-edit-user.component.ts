
import { Component, effect, inject, Input, OnInit, signal, TemplateRef, ViewChild, WritableSignal } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, catchError, delay, finalize, of, Subscription, tap } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'shared/services/notification/notification.service';
import { UserModel } from 'app/modules/users/models/user.model';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-add-edit-user',
  templateUrl: './add-edit-user.component.html',
  styleUrls: ['./add-edit-user.component.scss'],
  standalone: false
})
export class AddEditUserComponent implements OnInit {
  @ViewChild('content') content: TemplateRef<any>;
  private modalService = inject(NgbModal);
  formGroup: FormGroup;
  isLoading = false;
  subscriptions: Subscription[] = [];
  constructor(public formBuilder: FormBuilder,
    public notify: NotificationService,
    private userService: UserService
  ) {

  }
  ngOnInit(): void {
    this.userService.modalState$.subscribe(res => {

      if (res.isOpened && !this.modalService.hasOpenModals()) {
        this.open();
        if (res.user.id) {
          this.userService.getItemById(res.user.id).subscribe(response => {
            this.setFormGroup(response.data)
          });
        } else {
          this.setFormGroup(new UserModel())

        }

      }
    })
  }




  setFormGroup(user: UserModel) {
    const fullName = user?.first_name && user?.last_name ? user.first_name + ' ' + user.last_name : '';
    this.formGroup = new FormGroup({

      id: new FormControl(
        user.id,
      ),
      email: new FormControl(
        user.email,
        Validators.compose([
          Validators.required,
          Validators.email,
        ])
      ),
      fullName: new FormControl(
        fullName,
        Validators.compose([
          Validators.required,
        ])
      ),
      first_name: new FormControl(
        user.first_name

      ),
      last_name: new FormControl(
        user.last_name
      ),
      avatar: new FormControl(
        user.avatar
      ),

    });

  }

  // helpers for View
  isControlValid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }
  controlHasError(validation: any, controlName: any): boolean {
    const control = this.formGroup.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  controlHassError(): boolean {
    return this.formGroup?.touched && this.formGroup?.invalid
  }

  open() {
    this.modalService.open(this.content, { ariaLabelledBy: 'modal-basic-title' })
  }
  closeModal() {
    this.modalService.dismissAll()
  }
  submit() {
    if (this.formGroup.invalid) return;
    this.isLoading = true;
    if (!this.formGroup.value.id) {
      const sb = this.userService.create(this.formGroup.value).pipe(
        delay(1000),
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
    } else {
      const sb = this.userService.update(this.formGroup.value, this.formGroup.value.id).pipe(
        delay(1000),
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

  }
  ngOnDestroy(): void {
    this.modalService.dismissAll();
  }
}
