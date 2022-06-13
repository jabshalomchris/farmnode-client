import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { throwError, Observable, BehaviorSubject, of, finalize } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { LoginResponse } from '../auth/login/login.response.payload';
import { AuthService } from '../auth/shared/auth.service';

@Injectable({
  providedIn: 'root',
})
export class TokenInterceptorService implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  constructor(private injector: Injector) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let authService = this.injector.get(AuthService);
    const isLogged = authService.isLoggedIn();

    if (req.url.indexOf('refresh') !== -1 || req.url.indexOf('login') !== -1) {
      return next.handle(req);
    }

    //let token = '';
    if (isLogged) {
      if (req.url.slice(0, 27) != 'https://maps.googleapis.com') {
        return next.handle(this.addToken(req, authService.getJwtToken())).pipe(
          catchError((error) => {
            if (error instanceof HttpErrorResponse && error.status === 403) {
              return this.handleAuthErrors(req, next);
            } else {
              return throwError(error);
            }
          })
        ) as Observable<HttpEvent<any>>;

        // req = req.clone({
        //   setHeaders: {
        //     Authorization: `Bearer ${authService.getJwtToken()}`,
        //   },
        // });
      }
    }

    return next.handle(req);
  }

  private handleAuthErrors(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let authService = this.injector.get(AuthService);
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return authService
        .refreshToken()
        .pipe(
          switchMap((refreshTokenResponse: LoginResponse) => {
            this.isRefreshing = false;
            this.refreshTokenSubject.next(refreshTokenResponse.access_token);
            return next.handle(
              this.addToken(req, refreshTokenResponse.access_token)
            );
          })
        )
        .pipe(
          catchError((error) => {
            if (error instanceof HttpErrorResponse && error.status === 403) {
              authService.logout();
            }
            return throwError(error);
          })
        );
    } else {
      return this.refreshTokenSubject.pipe(
        filter((result) => result !== null),
        take(1),
        switchMap((res) => {
          return next.handle(this.addToken(req, authService.getJwtToken()));
        })
      );
    }
  }

  addToken(req: HttpRequest<any>, jwtToken: any) {
    return req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + jwtToken),
    });
  }
}
