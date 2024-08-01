import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HeaderService } from '../header/header.service';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private headers: HeaderService
  ) { }

  url = 'http://127.0.0.1:8000/api/';
  // url = 'http://192.168.18.185:8000/api/';
  private loggedIn = false;

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem('auth-token');
  }
  
  public login(formData: FormData) {
    return this.http.post(this.url + 'login/cataloging', formData).pipe(
      tap((res: any) => {
        if(res.token) {
          sessionStorage.setItem('auth-token', res.token);
          sessionStorage.setItem('name', res.displayName);
          sessionStorage.setItem('role', res.role);

          // token refresh if has token refresh
          let time = new Date();
          time.setMinutes(time.getMinutes() + 55);
          sessionStorage.setItem('request-token', time.toISOString());
        }
      })
    );
  }

  public logout() {
    return this.http.post(this.url + 'logout', {}, { headers: this.headers.get() }).pipe(
      tap((res: any) => {
        this.loggedIn = false;
      })
    );
  }
}
