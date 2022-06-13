import { Component, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/shared/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'farmnodeapp';
  //variables
  isLoggedIn: boolean;
  username: string;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.loggedIn.subscribe(
      (data: boolean) => (this.isLoggedIn = data)
    );
    this.isLoggedIn = this.authService.isLoggedIn();
    this.username = this.authService.getUserName();
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }

  @HostListener('window:scroll', []) onWindowScroll() {
    this.scrollFunction();
  }
  // When the user scrolls down 20px from the top of the document, show the button
  scrollFunction() {
    if (
      document.body.scrollTop > 20 ||
      document.documentElement.scrollTop > 20
    ) {
      document.getElementById('myBtn')!.style.display = 'block';
    } else {
      document.getElementById('myBtn')!.style.display = 'none';
    }
  }

  // When the user clicks on the button, scroll to the top of the document
  topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }
}
