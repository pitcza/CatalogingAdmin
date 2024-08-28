import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { Observable, throwError, tap, catchError } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap(event => {
        // console.log('Request successful:', event);
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.router.navigate(['/login']);
          Swal.fire({
            title: "Login Error!",
            text: "Invalid Credentials",
            icon: "error",
            confirmButtonText: 'Close',
            confirmButtonColor: "#777777",
            scrollbarPadding: false,
            timer: 2500
          });
          return throwError(() => new Error('Unauthenticated'));
        } else if (error.status === 409) {
          Swal.fire({
            title: 'Oops! Duplicate accession detected!',
            text: error.error.message,
            icon: 'error',
            confirmButtonText: 'Close',
            confirmButtonColor: "#777777",
            scrollbarPadding: false,
            willOpen: () => {
              document.body.style.overflowY = 'scroll';
            },
            willClose: () => {
              document.body.style.overflowY = 'scroll';
            }
          });
        } else if (error.status === 500) {
          let title = 'Oops! Server side error!';
          let text = 'Please contact the developers'; 
          if(error.error.message.includes('Duplicate entry')) {
            title = 'Invalid accession';
            text = 'Duplicate accession detected!'
          } 
          
          Swal.fire({
            title: title,
            text: text,
            icon: 'error',
            confirmButtonText: 'Close',
            confirmButtonColor: "#777777",
            scrollbarPadding: false,
            willOpen: () => {
              document.body.style.overflowY = 'scroll';
            },
            willClose: () => {
              document.body.style.overflowY = 'scroll';
            }
          });
        } else {
          Swal.fire({
            title: 'Oops! An error has occured',
            text: error.error.message,
            icon: 'error',
            confirmButtonText: 'Close',
            confirmButtonColor: "#777777",
            scrollbarPadding: false,
            willOpen: () => {
              document.body.style.overflowY = 'scroll';
            },
            willClose: () => {
              document.body.style.overflowY = 'scroll';
            }
          });
        }
        
        return throwError(() => new Error(error.error.message));
      })
    );
  }
}