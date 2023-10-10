import { Observable } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from 'src/environments/environment'

@Injectable({
    providedIn: 'root'
})
export class AnalyticsService {
    constructor(private readonly httpClient: HttpClient) {}

    fetchByCollection(collectionId: string, filterData: any): Observable<any> {
        return this.httpClient.get(
            `${environment.serverApiUrl}/analytics/${collectionId}?filter=${JSON.stringify(
                filterData
            )}`
        )
    }
}
