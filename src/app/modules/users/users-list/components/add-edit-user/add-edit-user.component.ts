
import { Component, effect, inject, Input, OnInit, signal, TemplateRef, ViewChild, WritableSignal } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'shared/services/notification/notification.service';
import { UserModel } from 'app/modules/users/models/user.model';

@Component({
  selector: 'app-add-edit-user',
  templateUrl: './add-edit-user.component.html',
  styleUrls: ['./add-edit-user.component.scss'],
  standalone: false
})
export class AddEditUserComponent implements OnInit {
  @ViewChild('content') content: TemplateRef<any>;
  @Input() modalState: BehaviorSubject<{ isOpened: boolean, isEdit: boolean, user: UserModel }> = new BehaviorSubject({ isOpened: false, isEdit: false, user: new UserModel() });
  formGroup: FormGroup;
  constructor(public formBuilder: FormBuilder,
    public notify: NotificationService) {

  }

  ngOnInit(): void {
    this.modalState.subscribe(res => {
      if (res.isOpened) {
        this.open();
        this.setFormGroup(res.user || new UserModel(), res.isEdit)
      }
    })
  }


  private modalService = inject(NgbModal);
  closeResult: WritableSignal<string> = signal('');

  setFormGroup(user: UserModel, isEdit: Boolean) {
    const fullName = user?.first_name && user?.last_name ? user.first_name + ' ' + user.last_name : '';
    this.formGroup = new FormGroup({

      id: new FormControl(
        user.id,
      ),
      email: new FormControl(
        { value: user.email, disabled: !isEdit },
        Validators.compose([
          Validators.required,
          Validators.email,
        ])
      ),
      fullName: new FormControl(
        { value: fullName, disabled: !isEdit },
        Validators.compose([
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ])
      ),
      first_name: new FormControl(
        { value: user.first_name, disabled: !isEdit },

      ),
      last_name: new FormControl(
        { value: user.last_name, disabled: !isEdit },
      ),
      avatar: new FormControl(
        { value: user.avatar, disabled: !isEdit },
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
    this.closeModal();
  }
  
}
