import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize, throwError } from 'rxjs';
import { AuthService } from '../shared/auth.service';
import { SignupRequestPayload } from './signup.request.payload';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  hide = true;
  signupForm: FormGroup;
  signupRequestPayload: SignupRequestPayload;
  registerSuccessMessage: string;
  isError: boolean;

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.signupRequestPayload = {
      username: '',
      name: '',
      password: '',
    };
  }

  ngOnInit(): void {
    this.signupForm = new FormGroup({
      username: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  register(submitBtn) {
    submitBtn.disabled = true;
    this.signupRequestPayload.username = this.signupForm.get('username')?.value;
    this.signupRequestPayload.name = this.signupForm.get('name')?.value;
    this.signupRequestPayload.password = this.signupForm.get('password')?.value;

    this.authService
      .signup(this.signupRequestPayload)
      .pipe(
        finalize(() => {
          submitBtn.disabled = false;
        })
      )
      .subscribe(
        (response) => {
          this.isError = false;
          this.toastr.success('Registration Successful');
          this.router.navigateByUrl('/login');

          //console.log('Login Successful')
        },
        (error) => {
          this.isError = true;
          throwError(error.message);
          this.toastr.error(error.message);
        }
      );
    submitBtn.disabled = true;
  }
}
