import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpEvent,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor (
    private router: Router
  ) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && error.error.message == 'Invalid credentials') {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Login Failed",
            showConfirmButton: false,
            timer: 2000
          });
        } else if(error.status === 401) {
          this.router.navigate(['login']);
          Swal.fire({
            position: "center",
            icon: "info",
            title: "Session expired",
            text: "Please log in again",
            showConfirmButton: true,
            confirmButtonText: "Okay",
            timer: 3000
          });
        }
        return throwError(() => new Error(error.error.message))
      })
    );
  }
}
