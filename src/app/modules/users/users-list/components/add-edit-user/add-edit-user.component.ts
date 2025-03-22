
import { Component, effect, inject, Input, OnInit, signal, TemplateRef, ViewChild, WritableSignal } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, catchError, delay, finalize, Observable, of, Subscription, tap } from 'rxjs';
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
  isLoading$: Observable<boolean>;

  subscriptions: Subscription[] = [];
  constructor(public formBuilder: FormBuilder,
    public notify: NotificationService,
    private userService: UserService
  ) {
    this.isLoading$ = this.userService.isLoading$;

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



  get formControl() { return this.formGroup.controls; }

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
          //  Validators.pattern('^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')
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



  open() {
    this.modalService.open(this.content, { ariaLabelledBy: 'modal-basic-title' })
  }
  closeModal() {
    this.modalService.dismissAll()
  }
  submit() {

    if (!this.formGroup.value.id) {
      const sb = this.userService.create(this.formGroup.value).pipe(
        delay(1000),
        tap(() => this.closeModal()),
        catchError((err) => {
          this.notify.showError('Create User Faild !','')
          return of(undefined);
        }),
        finalize(() => {
          this.modalService.dismissAll();

        })
      ).subscribe((res)=>{
        if(res){
          this.notify.showSuccess('User Created Succesfully !', '')

        }else{
          this.notify.showError('Create User Faild !', '')

        }
      });
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
      ).subscribe((res)=>{
        if (res) {
          this.notify.showSuccess('User Updated Succesfully !', '')

        } else {
          this.notify.showError('Update User Faild !', '')

        }
      });
      this.subscriptions.push(sb);
    }

  }
  ngOnDestroy(): void {
    this.modalService.dismissAll();
  }
}
