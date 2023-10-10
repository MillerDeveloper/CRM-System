import { ComponentFixture, TestBed } from '@angular/core/testing'

import { CollectionComponent } from './collection.component'
import { RouterTestingModule } from '@angular/router/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { TranslateModule } from '@ngx-translate/core'
import { MessageService } from 'primeng/api'
import { DatePipe } from '@angular/common'

describe('CollectionComponent', () => {
    let component: CollectionComponent
    let fixture: ComponentFixture<CollectionComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CollectionComponent],
            imports: [RouterTestingModule, HttpClientTestingModule, TranslateModule.forRoot()],
            providers: [MessageService, DatePipe]
        }).compileComponents()

        fixture = TestBed.createComponent(CollectionComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
