import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user.service';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  constructor(private us: UserService) {}

  public get() {
    const headers = new HttpHeaders({
      // 'Content-Type': 'application/json',
      // 'Accept': 'application/json',
      // 'Authorization': 'Bearer ' + sessionStorage.getItem('auth-token')
      Authorization: 'Bearer ' + this.us.savedAuth.authToken,
    });

    return headers;
  }
}
