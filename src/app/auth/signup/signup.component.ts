import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize, throwError } from 'rxjs';
import { AuthService } from '../shared/auth.service';
import { SignupRequestPayload } from './signup.request.payload';
import Swal from 'sweetalert2';

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
  passwordMatch: boolean = false;
  selectedFile: File;

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
      gender: '',
      userDescription: '',
      contactNo: '',
    };
  }

  ngOnInit(): void {
    this.signupForm = new FormGroup({
      fname: new FormControl('', Validators.required),
      lname: new FormControl('', Validators.required),
      contactNo: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      image: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required),
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      cpassword: new FormControl('', Validators.required),
    });
  }

  evaluatePassword() {
    if (
      this.signupForm.get('password')?.value ==
      this.signupForm.get('cpassword')?.value
    ) {
      this.passwordMatch = true;
    } else {
      this.passwordMatch = false;
    }
  }

  register(submitBtn) {
    if (this.signupForm.valid) {
      this.evaluatePassword();
      if (this.passwordMatch == true) {
        submitBtn.disabled = true;
        const name =
          this.signupForm.get('fname')?.value.charAt(0).toUpperCase() +
          this.signupForm.get('fname')?.value.slice(1) +
          ' ' +
          this.signupForm.get('lname')?.value.charAt(0).toUpperCase() +
          this.signupForm.get('lname')?.value.slice(1);
        this.signupRequestPayload.username =
          this.signupForm.get('username')?.value;
        this.signupRequestPayload.name = name;
        this.signupRequestPayload.password =
          this.signupForm.get('cpassword')?.value;
        this.signupRequestPayload.userDescription =
          this.signupForm.get('description')?.value;
        this.signupRequestPayload.gender = this.signupForm.get('gender')?.value;
        this.signupRequestPayload.contactNo =
          this.signupForm.get('contactNo')?.value;

        this.authService
          .signup(this.signupRequestPayload, this.selectedFile)
          .pipe(
            finalize(() => {
              submitBtn.disabled = false;
            })
          )
          .subscribe(
            (response) => {
              this.isError = false;
              Swal.fire({
                icon: 'success',
                text: 'Registration Successful! You can now login...',
                showConfirmButton: false,
                // confirmButtonColor: '#8EB540',
                timer: 2000,
              });
              this.router.navigateByUrl('/login');
            },
            (error) => {
              this.isError = true;
              Swal.fire({
                icon: 'error',
                text: 'Given e-mail already exists!',
                showConfirmButton: false,
                // confirmButtonColor: '#8EB540',
                timer: 1500,
              });
              throwError(error.message);
            }
          );
        submitBtn.disabled = true;
      } else {
        Swal.fire({
          icon: 'error',
          text: 'Passwords do not match!',
          confirmButtonColor: '#8EB540',
        });
        submitBtn.disabled = false;
      }
    } else {
      Swal.fire({
        icon: 'error',
        text: 'Please fill all the required fields and try again!',
        confirmButtonColor: '#8EB540',
      });
      submitBtn.disabled = false;
    }
  }

  upload(event) {
    const file: File = event.target.files[0];
    var pattern = /image-*/;

    if (!file.type.match(pattern)) {
      Swal.fire({
        icon: 'error',
        text: 'Unacceptable File type!',
        confirmButtonColor: '#8EB540',
      });
      this.signupForm.patchValue({
        image: '',
      });
      return;
    } else {
      this.selectedFile = event.target.files[0];
    }
  }
}
