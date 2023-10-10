import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { environment } from 'src/environments/environment'

@Injectable({
    providedIn: 'root'
})
export class CallService {
    constructor(private readonly httpClient: HttpClient) {}

    findAll(filter: any = {}): Observable<any> {
        return this.httpClient.get(
            `${environment.serverApiUrl}/calls?filter=${JSON.stringify(filter)}`
        )
    }
}
