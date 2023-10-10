import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { environment } from 'src/environments/environment'

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(private readonly httpClient: HttpClient) {}

    login(data: any): Observable<any> {
        return this.httpClient.post(`${environment.serverApiUrl}/auth/login`, data)
    }

    register(data: any): Observable<any> {
        return this.httpClient.post<any>(`${environment.serverApiUrl}/auth/register`, data)
    }

    verifyEmail(email: string): Observable<void> {
        return this.httpClient.post<any>(`${environment.serverApiUrl}/auth/verifyEmail`, {
            email: email
        })
    }

    verifyEmailCode(data: { email: string; verificationCode: string }): Observable<void> {
        return this.httpClient.post<any>(`${environment.serverApiUrl}/auth/verifyEmailCode`, data)
    }
}
