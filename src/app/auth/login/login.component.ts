import { AuthService } from './../shared/auth.service';
import { LoginRequestPayload } from './login.request.payload';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize, throwError } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  hide = true;
  loginForm: FormGroup;
  loginRequestPayload: LoginRequestPayload;
  registerSuccessMessage: string;
  isError: boolean;

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.loginRequestPayload = {
      username: '',
      password: '',
    };
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.toastr.success('You have already logged in');
      this.router.navigate(['/home']);
    }

    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  login(submitBtn) {
    if (this.loginForm.valid) {
      submitBtn.disabled = true;
      this.loginRequestPayload.username = this.loginForm.get('username')?.value;
      this.loginRequestPayload.password = this.loginForm.get('password')?.value;

      this.authService
        .login(this.loginRequestPayload)
        .pipe(
          finalize(() => {
            submitBtn.disabled = false;
          })
        )
        .subscribe(
          (data) => {
            this.isError = false;
            Swal.fire({
              icon: 'success',
              title: 'Logged in successfully',
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            });
            this.router.navigateByUrl('/home');

            //console.log('Login Successful')
          },
          (error) => {
            this.isError = true;
            throwError(error);
            Swal.fire({
              icon: 'error',
              text: 'Invalid credentials!',
              confirmButtonColor: '#8EB540',
            });
          }
        );
      submitBtn.disabled = true;
    } else {
      Swal.fire({
        icon: 'error',
        text: 'Please fill all the required fields and try again!',
        confirmButtonColor: '#8EB540',
      });
    }

    //this.authService.login2(this.loginRequestPayload).subscribe(data=>{
    //   console.log('Login Successful')
    // })
  }
}
