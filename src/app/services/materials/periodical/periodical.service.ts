import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HeaderService } from '../../header.service';
import { apiUrl } from '../../../../config/url';

@Injectable({
  providedIn: 'root'
})
export class PeriodicalService {

  constructor(
    private http: HttpClient,
    private headers: HeaderService
  ) { }

  url = apiUrl + 'periodicals/';

  public getJournals() {
    return this.http.get(this.url + 'type/0', { headers: this.headers.get() });
  }

  public getMagazines() {
    return this.http.get(this.url + 'type/1', { headers: this.headers.get() });
  }

  public getNewspapers() {
    return this.http.get(this.url + 'type/2', { headers: this.headers.get() });
  }

  public getRecord(accession: string) {
    return this.http.get(apiUrl + 'periodical/id/' + accession, { headers: this.headers.get() });
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
