import { ComponentFixture, TestBed } from '@angular/core/testing'

import { CreateCollectionComponent } from './create-collection.component'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import { TranslateModule } from '@ngx-translate/core'

describe('CreateCollectionComponent', () => {
    let component: CreateCollectionComponent
    let fixture: ComponentFixture<CreateCollectionComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CreateCollectionComponent],
            imports: [TranslateModule.forRoot()],
            providers: [DynamicDialogRef, DynamicDialogConfig]
        }).compileComponents()

        fixture = TestBed.createComponent(CreateCollectionComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
