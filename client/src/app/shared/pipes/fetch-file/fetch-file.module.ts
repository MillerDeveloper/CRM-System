import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FetchFilePipe } from './fetch-file.pipe'

@NgModule({
    declarations: [FetchFilePipe],
    imports: [CommonModule],
    exports: [FetchFilePipe]
})
export class FetchFileModule {}
