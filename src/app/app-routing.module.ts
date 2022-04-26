import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { MappingComponent } from './mapping/mapping.component';

const routes: Routes = [
  {path: 'sign-up', component: SignupComponent},
  { path: 'login', component: LoginComponent },
  { path:'map', component: MappingComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
