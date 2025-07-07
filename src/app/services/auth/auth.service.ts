import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HeaderService } from '../header/header.service';
import { tap } from 'rxjs';
import { appSettings } from '../../../config/app.settings';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private headers: HeaderService) {}
  private loggedIn = false;

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem('auth-token');
  }

  public login(formData: FormData) {
    return this.http
      .post(appSettings.apiUrlBase + 'login/cataloging', formData)
      .pipe(
        tap((res: any) => {
          if (res.token) {
            sessionStorage.setItem('auth-token', res.token);
            sessionStorage.setItem('name', res.displayName);
            sessionStorage.setItem('role', res.role);
            this.loggedIn = true;

            // token refresh if has token refresh
            let time = new Date();
            time.setMinutes(time.getMinutes() + 55);
            sessionStorage.setItem('request-token', time.toISOString());
          }
        })
      );
  }

  public logout() {
    return this.http
      .post(
        appSettings.apiUrlBase + 'logout',
        {},
        { headers: this.headers.get() }
      )
      .pipe(
        tap((res: any) => {
          this.loggedIn = false;
        })
      );
  }
}
