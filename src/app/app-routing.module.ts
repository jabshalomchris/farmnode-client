import { ProduceRequestComponent } from './produce-request/produce-request.component';
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
import { FindProducesComponent } from './produce/find-produces/find-produces.component';
import { OtherProduceComponent } from './produce/other-produce/other-produce.component';
import { MySubscriptionsComponent } from './subscription/my-subscriptions/my-subscriptions.component';
import { CommunityComponent } from './community/community.component';
import { CreatePostComponent } from './community/create-post/create-post.component';
import { ViewFriendsComponent } from './friends/view-friends/view-friends.component';
import { ViewUserComponent } from './users/view-user/view-user.component';
import { ViewSentRequestComponent } from './produce-request/view-sent-request/view-sent-request.component';
import { ViewRecievedRequestComponent } from './produce-request/view-recieved-request/view-recieved-request.component';
import { ViewRequestComponent } from './produce-request/view-request/view-request.component';
import { UpdateRequestComponent } from './produce-request/update-request/update-request.component';
import { ViewPostsComponent } from './community/view-posts/view-posts.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'sign-up', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'map', component: MappingComponent },
  { path: 'find-produce', component: FindProducesComponent },
  {
    path: 'my-produce',
    component: MyProduceComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'viewproduce/:produceId',
    component: ViewProduceComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'produce/:produceId',
    component: OtherProduceComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'post-produce',
    component: AddProduceComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'my-subscription',
    component: MySubscriptionsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'community',
    component: CommunityComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'create-post',
    component: CreatePostComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'view-friends',
    component: ViewFriendsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'view-user/:userId',
    component: ViewUserComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'produce-request',
    component: ProduceRequestComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'view-sent-request',
    component: ViewSentRequestComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'view-received-request',
    component: ViewRecievedRequestComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'view-request/:requestId',
    component: ViewRequestComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'update-request/:requestId',
    component: UpdateRequestComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'view-post/:postId',
    component: ViewPostsComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
