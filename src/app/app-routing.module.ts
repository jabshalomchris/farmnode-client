import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { MappingComponent } from './mapping/mapping.component';
import { MyProduceComponent } from './produce/my-produce/my-produce.component';
import { HomeComponent } from './home/home.component';
import { AppComponent } from './app.component';
import { AuthGuard } from './services/auth-guard.service';
import { ViewProduceComponent } from './produce/view-produce/view-produce.component';
import { AddProduceComponent } from './produce/add-produce/add-produce.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'sign-up', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'map', component: MappingComponent },
  {
    path: 'my-produce',
    component: MyProduceComponent,
    canActivate: [AuthGuard],
  },
  { path: 'viewproduce/:produceId', component: ViewProduceComponent },
  { path: 'post-produce', component: AddProduceComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
