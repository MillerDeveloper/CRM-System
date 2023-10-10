import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SettingsSidebarComponent } from './settings-sidebar.component'
import { DialogService } from 'primeng/dynamicdialog'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { TranslateModule } from '@ngx-translate/core'

describe('SettingsSidebarComponent', () => {
    let component: SettingsSidebarComponent
    let fixture: ComponentFixture<SettingsSidebarComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SettingsSidebarComponent],
            imports: [HttpClientTestingModule, TranslateModule.forRoot()],
            providers: [DialogService]
        }).compileComponents()

        fixture = TestBed.createComponent(SettingsSidebarComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
