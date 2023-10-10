import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ElementFieldsComponent } from './element-fields.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { TranslateModule } from '@ngx-translate/core'
import { MessageService } from 'primeng/api'
import { DatePipe } from '@angular/common'

describe('ElementFieldsComponent', () => {
    let component: ElementFieldsComponent
    let fixture: ComponentFixture<ElementFieldsComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ElementFieldsComponent],
            imports: [HttpClientTestingModule, TranslateModule.forRoot()],
            providers: [MessageService, DatePipe]
        }).compileComponents()

        fixture = TestBed.createComponent(ElementFieldsComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
