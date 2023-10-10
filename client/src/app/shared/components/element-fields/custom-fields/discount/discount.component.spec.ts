import { ComponentFixture, TestBed } from '@angular/core/testing'

import { DiscountComponent } from './discount.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { TranslateModule } from '@ngx-translate/core'
import { MessageService } from 'primeng/api'
import { DatePipe } from '@angular/common'
import { OverlayPanelModule } from 'primeng/overlaypanel'
import { FormGroup, FormControl } from '@angular/forms'
import { CollectionElementService } from '@/shared/services/collection-element/collection-element.service'

describe('DiscountComponent', () => {
    let component: DiscountComponent
    let fixture: ComponentFixture<DiscountComponent>
    let fakeCollectionElementService = jasmine.createSpyObj('fakeCollectionElementService', [
        'getElementCurrency'
    ])

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DiscountComponent],
            imports: [HttpClientTestingModule, TranslateModule.forRoot(), OverlayPanelModule],
            providers: [
                MessageService,
                DatePipe,
                {
                    provide: CollectionElementService,
                    useValue: fakeCollectionElementService
                }
            ]
        }).compileComponents()

        fixture = TestBed.createComponent(DiscountComponent)
        component = fixture.componentInstance
        component.config = {
            fieldForm: new FormGroup({
                fieldValue: new FormControl(null)
            }),
            element: {
                currency: {
                    value: 'USD'
                },
                price: {
                    value: 100
                },
                quantity: {
                    value: 5
                }
            },
            field: null,
            disabled: false
        }

        fakeCollectionElementService.getElementCurrency.and.returnValue('USD')
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })

    it('Must toggled overlay panel', () => {
        const event = jasmine.createSpyObj('event', ['stopImmediatePropagation', 'stopPropagation'])
        spyOn(component.opRef, 'toggle')
        component.toggleOp(event)
        expect(component.opRef.toggle).toHaveBeenCalledTimes(1)
    })

    it('Should calc discount', () => {
        const discount = 20
        component.elementPrice = 100
        component.calcDiscount({ value: discount })
        expect(component.config.fieldForm.value.fieldValue).toBe(20)
    })

    it('Should get currency USD', () => {
        expect(fakeCollectionElementService.getElementCurrency()).toBe('USD')
    })

    it('Must emit to close panel', () => {
        const event = jasmine.createSpyObj('event', ['stopPropagation'])
        spyOn(component.opRef, 'toggle')
        spyOn(component.setValue, 'emit')

        component.closeOp(event)

        expect(component.setValue.emit).toHaveBeenCalled()
        expect(component.opRef.toggle).toHaveBeenCalledWith(event)
    })
})
