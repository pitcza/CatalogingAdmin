import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HeaderService } from '../header/header.service';
import { appSettings } from '../../../config/app.settings';
import { UserService } from '../user.service';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(
    private http: HttpClient,
    private headers: HeaderService,
    private us: UserService,
  ) {}

  projects: any;

  public request(method: string, url: string, form: any) {
    const options: any = {
      headers: this.headers.get(),
      withCredentials: false,
    };
    let bodyToSend = form;

    if (form instanceof FormData) {
      const plain: any = {};
      const fileEntries: Record<string, File> = {};

      form.forEach((value, key) => {
        if (value instanceof File) {
          fileEntries[key] = value;
        } else {
          plain[key] = value;
        }
      });

      const encrypted = this.us.encryptPayload(plain);

      const finalForm = new FormData();
      finalForm.append('ml', encrypted);

      for (const key in fileEntries) {
        finalForm.append(key, fileEntries[key]);
      }

      bodyToSend = finalForm;
    }

    switch (method) {
      case 'GET':
        return this.http.get(appSettings.apiUrlSystem + url, options);
      case 'POST':
        return this.http.post(
          appSettings.apiUrlSystem + url,
          bodyToSend,
          options,
        );
      case 'PUT':
        return this.http.post(
          appSettings.apiUrlSystem + url,
          bodyToSend,
          options,
        );
      case 'DELETE':
        return this.http.delete(appSettings.apiUrlSystem + url, options);
      default:
        throw new Error(`Unsupported request method: ${method}`);
    }
  }
}
