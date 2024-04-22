import { Injectable } from '@angular/core';
import { HeaderService } from './header.service';
import { HttpClient } from '@angular/common/http';

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
    return this.http.post(this.url+'login/cataloging', formData);
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
