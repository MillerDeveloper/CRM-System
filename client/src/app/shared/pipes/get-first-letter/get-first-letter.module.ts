import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { GetFirstLetterPipe } from './get-first-letter.pipe'

@NgModule({
    declarations: [GetFirstLetterPipe],
    imports: [CommonModule],
    exports: [GetFirstLetterPipe]
})
export class GetFirstLetterModule {}
