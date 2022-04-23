import { AuthService } from './../shared/auth.service';
import { LoginRequestPayload } from './login.request.payload';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { throwError } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loginRequestPayload: LoginRequestPayload;
  registerSuccessMessage: string;
  isError: boolean;

  constructor(private authService: AuthService, private activatedRoute: ActivatedRoute,
    private router: Router, private toastr: ToastrService) {
    this.loginRequestPayload={
      username:'',
      password:''
    };
   }

  ngOnInit(): void {
    this.loginForm=new FormGroup({
      username: new FormControl('',Validators.required),
      password: new FormControl('',Validators.required)
    })
  }

  login(){
    this.loginRequestPayload.username=this.loginForm.get('username')?.value;
    this.loginRequestPayload.password=this.loginForm.get('password')?.value;
    
     this.authService.login(this.loginRequestPayload).subscribe(data=>{
      this.isError = false;
      //this.router.navigateByUrl('');
      this.toastr.success('Login Successful');
      //console.log('Login Successful')
     },error=>{
      this.isError = true;
      throwError(error);
      this.toastr.error('Login unsuccessful');
     }
     
     );
    //this.authService.login2(this.loginRequestPayload).subscribe(data=>{
      //   console.log('Login Successful')
      // })
  }

}
