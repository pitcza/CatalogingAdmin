import { Injectable } from '@angular/core';
import { apiUrl } from '../../../../config/url';
import { HttpClient } from '@angular/common/http';
import { HeaderService } from '../../header.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  
  constructor(
    private http: HttpClient,
    private headers: HeaderService
  ) { }

  url = apiUrl + 'projects/';

  public getPrograms() {
    return this.http.get(apiUrl + 'programs', { headers: this.headers.get() });
  }
  public getProjects() {
    return this.http.get(this.url, { headers: this.headers.get() });
  }

  public getRecord(accession: string) {
    return this.http.get(apiUrl + 'project/id/' + accession, { headers: this.headers.get() });
  }

  public addRecord(form: FormData) {
    return this.http.post(this.url + 'process', form, { headers: this.headers.get() });
  }

  public updateRecord(accession: string, form: FormData) {
    form.append('_method', 'PUT');
    return this.http.post(this.url + 'process/' + accession, form, { headers: this.headers.get() });
  }

  public deleteRecord(accession: string) {
    return this.http.delete(apiUrl + 'projects/archive/' + accession, { headers: this.headers.get() });
  }
}
