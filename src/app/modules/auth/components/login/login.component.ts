
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseAuthService } from 'shared/services/auth/base.auth.service';
import { NotificationService } from 'shared/services/notification/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false,
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  hasError: boolean;
  returnUrl: string;
  isLoading$: Observable<boolean>;

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private fb: FormBuilder,
    private authService: BaseAuthService,
    private route: ActivatedRoute,
    private router: Router,
    private notify:NotificationService
  ) {
    this.isLoading$ = this.authService.isLoading$;
    // redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnInit(): void {
    this.initForm();

    // get return url from route parameters or default to '/'
    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'.toString()] || '/dashboard';
  }

  // convenience getter for easy access to form fields

  initForm() {
    this.loginForm = this.fb.group({
      password: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required,
      Validators.pattern('^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')])],

    });
  }


  get f() { return this.loginForm.controls; }

  submit() {
     const loginSubscr = this.authService
      .LoginUser(this.f.email.value, this.f.password.value)
      .pipe(first())
      .subscribe((user: any) => {

          if (user) { 
           this.router.navigate([this.returnUrl]);
        } else {
            this.notify.showError('Invalid email or password','error')
         }
      });
    this.unsubscribe.push(loginSubscr);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
