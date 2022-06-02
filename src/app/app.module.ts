import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { HeaderComponent } from './shared/header/header.component';
import { SignupComponent } from './auth/signup/signup.component';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { MappingComponent } from './mapping/mapping.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FooterComponent } from './shared/footer/footer.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { ProduceComponent } from './produce/produce.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MyProduceComponent } from './produce/my-produce/my-produce.component';
import { AuthGuard } from './services/auth-guard.service';
import { ViewProduceComponent } from './produce/view-produce/view-produce.component';
import { PostsComponent } from './posts/posts.component';
import { PostTileComponent } from './community/post-tile/post-tile.component';
import { ViewUserComponent } from './users/view-user/view-user.component';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { SubscriptionComponent } from './subscription/subscription.component';
import { AddProduceComponent } from './produce/add-produce/add-produce.component';
import { FindProducesComponent } from './produce/find-produces/find-produces.component';
import { OtherProduceComponent } from './produce/other-produce/other-produce.component';
import { MySubscriptionsComponent } from './subscription/my-subscriptions/my-subscriptions.component';
import { CommunityComponent } from './community/community.component';
import { SideBarComponent } from './community/side-bar/side-bar.component';
import { CreatePostComponent } from './community/create-post/create-post.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { ViewFriendsComponent } from './friends/view-friends/view-friends.component';
import { ViewGrowerComponent } from './users/view-grower/view-grower.component';
import { ProduceRequestComponent } from './produce-request/produce-request.component';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { ProduceTileComponent } from './produce-request/produce-tile/produce-tile.component';
import { ViewSentRequestComponent } from './produce-request/view-sent-request/view-sent-request.component';
import { ViewRecievedRequestComponent } from './produce-request/view-recieved-request/view-recieved-request.component';
import { ViewPostsComponent } from './community/view-posts/view-posts.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    SignupComponent,
    MappingComponent,
    FooterComponent,
    NavbarComponent,
    HomeComponent,
    ProduceComponent,
    MyProduceComponent,
    ViewProduceComponent,
    PostsComponent,
    PostTileComponent,
    ViewUserComponent,
    SubscriptionComponent,
    AddProduceComponent,
    FindProducesComponent,
    OtherProduceComponent,
    MySubscriptionsComponent,
    CommunityComponent,
    SideBarComponent,
    CreatePostComponent,
    ViewFriendsComponent,
    ViewGrowerComponent,
    ProduceRequestComponent,
    PageNotFoundComponent,
    ProduceTileComponent,
    ViewSentRequestComponent,
    ViewRecievedRequestComponent,
    ViewPostsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgxWebstorageModule.forRoot(),
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgbModule,
    FontAwesomeModule,
    LeafletMarkerClusterModule,
    MatFormFieldModule,
    EditorModule,
    MatIconModule,
  ],
  providers: [
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
