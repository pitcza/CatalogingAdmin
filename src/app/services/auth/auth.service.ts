import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HeaderService } from '../header/header.service';
import { tap } from 'rxjs';
import { appSettings } from '../../../environments/environment';
import { UserService } from '../user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private headers: HeaderService,
    private us: UserService,
  ) {}
  private loggedIn = false;

  isLoggedIn(): boolean {
    if (this.us.savedAuth.authToken) return true;
    else return false;
  }

  public changePassword(form: object) {
    return this.http.post(appSettings.apiUrlBase + 'change-password', form, {
      headers: this.headers.get(),
    });
  }

  public login(formData: FormData) {
    return this.http
      .post(appSettings.apiUrlBase + 'login/cataloging', formData)
      .pipe(
        tap((res: any) => {
          if (res.token) {
            const details = {
              authToken: res.token,
              name: res.displayName,
              position: res.position,
            };
            const encrypted = this.us.encryptPayload(details);
            sessionStorage.setItem('xs', encrypted);

            this.loggedIn = true;

            // token refresh if has token refresh
            let time = new Date();
            time.setMinutes(time.getMinutes() + 55);
            sessionStorage.setItem('request-token', time.toISOString());
          }
        }),
      );
  }

  public logout() {
    return this.http
      .post(
        appSettings.apiUrlBase + 'logout',
        {},
        { headers: this.headers.get() },
      )
      .pipe(
        tap((res: any) => {
          this.loggedIn = false;
        }),
      );
  }
}
