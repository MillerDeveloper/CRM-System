import { ComponentFixture, TestBed } from '@angular/core/testing'

import { FilesComponent } from './files.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { DialogService } from 'primeng/dynamicdialog'
import { TranslateModule } from '@ngx-translate/core'

describe('FilesComponent', () => {
    let component: FilesComponent
    let fixture: ComponentFixture<FilesComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FilesComponent],
            imports: [HttpClientTestingModule, TranslateModule.forRoot()],
            providers: [DialogService]
        }).compileComponents()

        fixture = TestBed.createComponent(FilesComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
