import { Injectable } from '@angular/core';
import { HeaderService } from './header.service';
import { HttpClient } from '@angular/common/http';
import { response } from 'express';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private headers: HeaderService
  ) { }
  
  private url:string = 'http://127.0.0.1:8000/api/';

  public login(formData: FormData) {
    return this.http.post(this.url+'login/cataloging', formData).pipe(
      tap((res: any) => {
        if(res.token) {
          sessionStorage.setItem('auth-token', res.token);
          sessionStorage.setItem('name', res.displayName);
          sessionStorage.setItem('role', res.role);

          let time = new Date();
          time.setMinutes(time.getMinutes() + 55);
          sessionStorage.setItem('request-token', time.toISOString());
        }
      })
    );
  }

  public user() {
    return this.http.get(this.url + 'user', { headers: this.headers.get() });
  }

  public refresh() {
    return this.http.post(this.url + 'refresh', {}, { headers: this.headers.get() })
  }

  public logout() {
    return this.http.post(this.url + 'logout', {}, { headers: this.headers.get() })
  }
}
