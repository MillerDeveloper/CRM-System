import { Injectable } from '@angular/core'
import { catchError } from 'rxjs/operators'
import {
    HttpRequest,
    HttpHandler,
    HttpInterceptor,
    HttpErrorResponse,
    HttpEvent
} from '@angular/common/http'
import { Observable, throwError } from 'rxjs'
import { CookieService } from 'ngx-cookie-service'
import { Router } from '@angular/router'

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(private readonly cookieService: CookieService, private readonly router: Router) {}

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token: string = `Bearer ${this.cookieService.get('token')}`
        request = request.clone({
            setHeaders: {
                Authorization: token,
                Accept: 'application/json'
            }
        })

        return next
            .handle(request)
            .pipe(catchError((error: HttpErrorResponse) => this.handleAuthError(error)))
    }

    private handleAuthError(error: HttpErrorResponse): Observable<any> {
        if (error.status === 401) {
            this.router.navigate(['/login'], {
                queryParams: {
                    sessionFailed: true
                }
            })
        }

        return throwError(error)
    }
}
