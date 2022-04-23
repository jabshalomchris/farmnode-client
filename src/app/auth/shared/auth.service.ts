
import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpParams ,HttpHeaders} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { LocalStorageService } from 'ngx-webstorage';
import { LoginRequestPayload } from '../login/login.request.payload';
import { LoginResponse } from '../login/login.response.payload';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  @Output() loggedIn: EventEmitter<boolean> = new EventEmitter();
  @Output() username: EventEmitter<string> = new EventEmitter();

  refreshTokenPayload = {
    refreshToken: this.getRefreshToken(),
    username: this.getUserName()
  }

  constructor(private httpClient: HttpClient,
    private localStorage: LocalStorageService) {
  }

//   signup(signupRequestPayload: SignupRequestPayload): Observable<any> {
//     return this.httpClient.post('http://localhost:8080/api/auth/signup', signupRequestPayload, { responseType: 'text' });
//   }

  login(loginRequestPayload: LoginRequestPayload): Observable<boolean> {

    const body = new HttpParams()
      .set('username', loginRequestPayload.username)
      .set('password', loginRequestPayload.password);

    return this.httpClient.post<LoginResponse>('http://localhost:8080/api/login',
      body).pipe(map(data => {
        this.localStorage.store('access_token', data.access_token);
        this.localStorage.store('username', data.username);
        this.localStorage.store('refresh_token', data.refresh_token);

        this.loggedIn.emit(true);
        this.username.emit(data.username);
       // console.log(data);
        return true;
      }));
  }

  login2(loginRequestPayload: LoginRequestPayload): Observable<any> {
    const body = new HttpParams()
      .set('username', loginRequestPayload.username)
      .set('password', loginRequestPayload.password);
  
    return this.httpClient.post('http://localhost:8080/api/login',
      body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }
    );
  }



  getJwtToken() {
    return this.localStorage.retrieve('access_token');
  }

  refreshToken() {
    return this.httpClient.post<LoginResponse>('http://localhost:8080/api/auth/refresh/token',
      this.refreshTokenPayload)
      .pipe(tap(response => {
        this.localStorage.clear('access_token');
        this.localStorage.clear('expiresAt');

        this.localStorage.store('access_token',
          response.access_token);
        // this.localStorage.store('expiresAt', response.expiresAt);
      }));
  }

  logout() {
    this.httpClient.post('http://localhost:8080/api/auth/logout', this.refreshTokenPayload,
      { responseType: 'text' })
      .subscribe(data => {
        console.log(data);
      }, error => {
        throwError(error);
      })
    this.localStorage.clear('authenticationToken');
    this.localStorage.clear('username');
    this.localStorage.clear('refreshToken');
    this.localStorage.clear('expiresAt');
  }

  getUserName() {
    return this.localStorage.retrieve('username');
  }
  getRefreshToken() {
    return this.localStorage.retrieve('refresh_token');
  }

  isLoggedIn(): boolean {
    return this.getJwtToken() != null;
  }
}
