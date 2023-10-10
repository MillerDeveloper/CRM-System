import { ComponentFixture, TestBed } from '@angular/core/testing'

import { NovaposhtaComponent } from './novaposhta.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { DatePipe } from '@angular/common'
import { TranslateModule } from '@ngx-translate/core'

describe('NovaposhtaComponent', () => {
    let component: NovaposhtaComponent
    let fixture: ComponentFixture<NovaposhtaComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [NovaposhtaComponent],
            imports: [HttpClientTestingModule, TranslateModule.forRoot()],
            providers: [DatePipe]
        }).compileComponents()

        fixture = TestBed.createComponent(NovaposhtaComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
