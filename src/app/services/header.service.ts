import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  constructor() { }

  public get() {
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('auth-token')
    });

    return headers;
  }
  


}
