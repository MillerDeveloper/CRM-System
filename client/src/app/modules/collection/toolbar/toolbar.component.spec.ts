import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ToolbarComponent } from './toolbar.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { DialogService } from 'primeng/dynamicdialog'
import { TranslateModule } from '@ngx-translate/core'
import { MessageService } from 'primeng/api'

describe('ToolbarComponent', () => {
    let component: ToolbarComponent
    let fixture: ComponentFixture<ToolbarComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ToolbarComponent],
            imports: [HttpClientTestingModule, TranslateModule.forRoot()],
            providers: [DialogService, MessageService]
        }).compileComponents()

        fixture = TestBed.createComponent(ToolbarComponent)
        component = fixture.componentInstance
        component.config = {
            collection: null,
            loadingConfig: {
                isLoadingData: false,
            },
            selection: []
        }
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
