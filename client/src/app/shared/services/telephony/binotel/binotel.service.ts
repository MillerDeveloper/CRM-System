import { Observable } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from 'src/environments/environment'

@Injectable({
    providedIn: 'root'
})
export class BinotelService {
    constructor(private readonly httpClient: HttpClient) {}

    getCallDetails(generalCallID: string): Observable<any> {
        return this.httpClient.get(
            `${environment.serverApiUrl}/integrations/binotel/${generalCallID}/callDetails`
        )
    }

    setCallRecord(generalCallID: string, data: any): Observable<any> {
        return this.httpClient.post(
            `${environment.serverApiUrl}/integrations/binotel/${generalCallID}/callRecord`,
            data
        )
    }

    hangUp(generalCallID: string): Observable<any> {
        return this.httpClient.get(
            `${environment.serverApiUrl}/integrations/binotel/${generalCallID}/hangUp`
        )
    }
}
