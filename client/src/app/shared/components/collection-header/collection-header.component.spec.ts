import { ComponentFixture, TestBed } from '@angular/core/testing'

import { CollectionHeaderComponent } from './collection-header.component'
import { TranslateModule } from '@ngx-translate/core'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { MessageService } from 'primeng/api'

describe('CollectionHeaderComponent', () => {
    let component: CollectionHeaderComponent
    let fixture: ComponentFixture<CollectionHeaderComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CollectionHeaderComponent],
            imports: [TranslateModule.forRoot(), HttpClientTestingModule],
            providers: [MessageService]
        }).compileComponents()

        fixture = TestBed.createComponent(CollectionHeaderComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
