import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private http: HttpClient
  ) { }
  
  private url:string = 'http://127.0.0.1:8000/api/';

  public login(payload: any) {
    return this.http.post(this.url+'login/cataloging', payload);
  }

  public logout() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('auth-token')
    });

    return this.http.post(this.url + 'logout', {}, { headers: headers })
  }

  public get(endpoint: string, param: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('auth-token')
    });
    return this.http.get(this.url+endpoint+param, { headers: headers });
  }

  public getImage(endpoint: string, param: string) {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('auth-token')
      });
      
      return this.http.get(this.url+endpoint+param, { responseType: 'blob' }).pipe(
        catchError((error: HttpErrorResponse) => {
          
          return throwError(() => 'HTTP Response: No image found or invalid file found.');
        })
      );
  }

  public post(endpoint: string, param: string, payload: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('auth-token')
    });

    return this.http.post(this.url+endpoint+param, payload, { headers: headers });
  }
}
