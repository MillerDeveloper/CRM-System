import { ComponentFixture, TestBed } from '@angular/core/testing'

import { MainSidebarComponent } from './main-sidebar.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { TranslateModule } from '@ngx-translate/core'
import { MessageService } from 'primeng/api'
import { DatePipe } from '@angular/common'

describe('MainSidebarComponent', () => {
    let component: MainSidebarComponent
    let fixture: ComponentFixture<MainSidebarComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MainSidebarComponent],
            imports: [HttpClientTestingModule, TranslateModule.forRoot()],
            providers: [MessageService, DatePipe]
        }).compileComponents()

        fixture = TestBed.createComponent(MainSidebarComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
