import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpEvent, HttpErrorResponse, HttpHandler, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any> , next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError(error => {
                if(error.status === 401)
                {
                    return throwError(error.statusText + ' : Status Code 401 : ' +  error.error);
                }
                if (error instanceof HttpErrorResponse) {
                    const applicationError = error.headers.get('Application-Error');
                    if (applicationError) {
                        console.error(applicationError);
                        return throwError(applicationError);
                    }
                    const serverError = error.error.errors;
                    let modalStateError = '';
                    if (serverError && typeof serverError === 'object') {
                        for (const key in serverError) {
                            if (serverError[key]) {
                                modalStateError += serverError[key] +  '\n';
                                console.log(serverError[key] + '  Hello Error \n\n');
                                console.log(serverError[key] + '  Hello Error \n\n');
                            }
                        }
                    }
                    if(error.status === 400)
                    {
                        return throwError(error.statusText + ' : Status Code 400  ' + error.error);
                    }
                    return throwError(modalStateError || serverError || 'Server Errorsss');
                }
            })
        );
    }
}


export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true
};