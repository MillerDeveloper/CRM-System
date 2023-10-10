import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SitesComponent } from './sites.component'
import { DialogService } from 'primeng/dynamicdialog'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { TranslateModule } from '@ngx-translate/core'

describe('SitesComponent', () => {
    let component: SitesComponent
    let fixture: ComponentFixture<SitesComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SitesComponent],
            imports: [HttpClientTestingModule, TranslateModule.forRoot()],
            providers: [DialogService]
        }).compileComponents()

        fixture = TestBed.createComponent(SitesComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
