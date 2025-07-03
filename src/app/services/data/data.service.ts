import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HeaderService } from '../header/header.service';
import { apiUrl } from '../../../config/url';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient, private headers: HeaderService) {}

  projects: any;
  options: any = { headers: this.headers.get(), withCredentials: false };

  public request(method: string, url: string, form: any) {
    switch (method) {
      case 'GET':
        return this.http.get(apiUrl + url, this.options);

      case 'POST':
        return this.http.post(apiUrl + url, form, this.options);

      case 'PUT':
        // form.append('_method', 'PUT');
        return this.http.post(apiUrl + url, form, this.options);

      case 'DELETE':
        return this.http.delete(apiUrl + url, this.options);

      default:
        throw new Error(`Unsupported request method: ${method}`);
    }
  }
}
