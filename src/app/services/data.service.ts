import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs';
import { throwError } from 'rxjs';
import { HeaderService } from './header.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private http: HttpClient,
    private headers: HeaderService
  ) { }
  
  private url:string = 'http://127.0.0.1:8000/api/';

  public get(endpoint: string) {
    return this.http.get(this.url+endpoint, { headers: this.headers.get() });
  }

  public getImage(endpoint: string) {
      return this.http.get(this.url+endpoint, { responseType: 'blob', headers: this.headers.get() }).pipe(
        catchError((error: HttpErrorResponse) => {
          
          return throwError(() => 'HTTP Response: No image found or invalid file found.');
        })
      );
  }

  public post(endpoint: string, formData: FormData) {
    return this.http.post(this.url+endpoint, formData, { headers: this.headers.get() });
  }

  public delete(endpoint: string) {
    return this.http.delete(this.url+endpoint, { headers: this.headers.get() });
  }
}
