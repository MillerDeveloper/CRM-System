import {HttpClientModule} from '@angular/common/http'
import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TelegramControlsComponent } from './telegram-controls.component'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'

describe('TelegramControlsComponent', () => {
    let component: TelegramControlsComponent
    let fixture: ComponentFixture<TelegramControlsComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TelegramControlsComponent],
            imports: [HttpClientModule],
            providers: [DynamicDialogRef, DynamicDialogConfig]
        }).compileComponents()

        fixture = TestBed.createComponent(TelegramControlsComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
