import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HeaderService } from '../../header.service';
import { apiUrl } from '../../../../config/url';

@Injectable({
  providedIn: 'root'
})
export class AVService {

  constructor(
    private http: HttpClient,
    private headers: HeaderService
  ) { }

  url = apiUrl + 'materials/audio-visuals/';

  public getAll() {
    return this.http.get(this.url, { headers: this.headers.get() });
  }

  public getRecord(accession: string) {
    return this.http.get(apiUrl + 'material/id/' + accession, { headers: this.headers.get() });
  }

  public addRecord(form: FormData) {
    return this.http.post(this.url + 'process', form, { headers: this.headers.get() });
  }

  public updateRecord(accession: string, form: FormData) {
    form.append('_method', 'PUT');
    return this.http.post(this.url + 'process/' + accession, form, { headers: this.headers.get() });
  }

  public deleteRecord(accession: string) {
    return this.http.delete(apiUrl + 'material/archive/' + accession, { headers: this.headers.get() });
  }
}
