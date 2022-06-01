import { Component, OnInit } from '@angular/core';
import { animationFrameScheduler } from 'rxjs';
import { AuthService } from 'src/app/auth/shared/auth.service';
import { Router } from '@angular/router';
import {
  faUser,
  faRightFromBracket,
  faIdBadge,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  //variables
  isLoggedIn: boolean;
  username: string;

  //icons
  faUser = faUser;
  faRightFromBracket = faRightFromBracket;
  faIdBadge = faIdBadge;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.loggedIn.subscribe(
      (data: boolean) => (this.isLoggedIn = data)
    );
    this.authService.username.subscribe(
      (data: string) => (this.username = data)
    );

    this.isLoggedIn = this.authService.isLoggedIn();
    this.username = this.authService.getUserName();
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.router.navigateByUrl('');
  }
}
