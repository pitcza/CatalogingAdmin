import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HeaderService } from '../header/header.service';
import { apiUrl } from '../../../config/url';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private http: HttpClient,
    private headers: HeaderService
  ) { }

  public request(method: string, url: string, form: any) {
    switch(method) {
      case 'GET':
        return this.http.get(apiUrl + url, { headers: this.headers.get() });

      case 'POST':
        return this.http.post(apiUrl + url, form, { headers: this.headers.get() });

      case 'PUT':
        form.append('_method', 'PUT');
        return this.http.put(apiUrl + url, form, { headers: this.headers.get() });
      
      case 'DELETE':
        return this.http.delete(apiUrl + url, { headers: this.headers.get() });

        default:
          throw new Error(`Unsupported request method: ${method}`);
    }
  }
}

