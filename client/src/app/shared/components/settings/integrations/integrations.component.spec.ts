import { ComponentFixture, TestBed } from '@angular/core/testing'

import { IntegrationsComponent } from './integrations.component'
import { DialogService } from 'primeng/dynamicdialog'
import { HttpClientTestingModule } from '@angular/common/http/testing'

describe('IntegrationsComponent', () => {
    let component: IntegrationsComponent
    let fixture: ComponentFixture<IntegrationsComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [IntegrationsComponent],
            imports: [HttpClientTestingModule],
            providers: [DialogService]
        }).compileComponents()

        fixture = TestBed.createComponent(IntegrationsComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
