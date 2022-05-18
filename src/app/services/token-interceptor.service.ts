import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/shared/auth.service';

@Injectable({
  providedIn: 'root',
})
export class TokenInterceptorService implements HttpInterceptor {
  constructor(private injector: Injector) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let authService = this.injector.get(AuthService);
    const isLogged = authService.isLoggedIn();
    //let token = '';
    if (isLogged) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${authService.getJwtToken()}`,
        },
      });
    }

    return next.handle(req);
  }
}
