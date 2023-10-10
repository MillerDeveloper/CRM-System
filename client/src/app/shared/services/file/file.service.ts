import { CookieService } from 'ngx-cookie-service'
import { Observable } from 'rxjs'
import { environment } from 'src/environments/environment'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'

@Injectable({
    providedIn: 'root'
})
export class FileService {
    constructor(
        private readonly httpClient: HttpClient,
        private readonly cookieService: CookieService
    ) {}

    findMany(filter: any = {}): Observable<any> {
        return this.httpClient.get(
            `${environment.serverApiUrl}/files?filter=${JSON.stringify(filter)}`
        )
    }

    upload(formData: FormData, data: { id?: string; currentPath?: string }): Observable<any> {
        return this.httpClient.post(
            `${environment.serverApiUrl}/files/upload/${data.id ?? ''}?path=${data.currentPath}`,
            formData
        )
    }

    deleteMany(ids: string[]): Observable<any> {
        return this.httpClient.delete(`${environment.serverApiUrl}/files/${ids.join('|')}`)
    }

    downloadOne(id: string) {
        return this.httpClient.get(this.getFileUrl(id, false), {
            responseType: 'blob'
        })
    }

    getFileUrl(id: string, setToken: boolean = true) {
        let url = `${environment.serverApiUrl}/files/${id}`

        if (setToken) {
            return `${url}?accessToken=${this.cookieService.get('token')}`
        } else {
            return url
        }
    }

    deleteOne(id: string): Observable<any> {
        return this.deleteMany([id])
    }
}
