import { ComponentFixture, TestBed } from '@angular/core/testing'

import { NotificationsOverlayComponent } from './notifications-overlay.component'
import { TranslateModule } from '@ngx-translate/core'

describe('NotificationsOverlayComponent', () => {
    let component: NotificationsOverlayComponent
    let fixture: ComponentFixture<NotificationsOverlayComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [NotificationsOverlayComponent],
            imports: [TranslateModule.forRoot()]
        }).compileComponents()

        fixture = TestBed.createComponent(NotificationsOverlayComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
