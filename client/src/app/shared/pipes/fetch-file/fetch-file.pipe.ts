import { environment } from 'src/environments/environment'
import { Pipe, PipeTransform } from '@angular/core'
import { CookieService } from 'ngx-cookie-service'

@Pipe({
    name: 'fetchFile'
})
export class FetchFilePipe implements PipeTransform {
    constructor(private readonly cookieService: CookieService) {}

    transform(id: string): unknown {
        return `${
            environment.serverApiUrl
        }/files/download/${id}?accessToken=${this.cookieService.get('token')}`
    }
}
