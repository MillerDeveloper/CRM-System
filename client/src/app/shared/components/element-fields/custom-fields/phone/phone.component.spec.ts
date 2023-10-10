import { ComponentFixture, TestBed } from '@angular/core/testing'

import { PhoneComponent } from './phone.component'
import { TranslateModule } from '@ngx-translate/core'
import { ChipModule } from 'primeng/chip'
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { OverlayPanelModule } from 'primeng/overlaypanel'
import { ButtonModule } from 'primeng/button'

describe('PhoneComponent', () => {
    let component: PhoneComponent
    let fixture: ComponentFixture<PhoneComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PhoneComponent],
            imports: [
                TranslateModule.forRoot(),
                ChipModule,
                ReactiveFormsModule,
                OverlayPanelModule,
                ButtonModule
            ]
        }).compileComponents()

        fixture = TestBed.createComponent(PhoneComponent)
        component = fixture.componentInstance
        component.config = {
            fieldForm: new FormGroup({
                fieldValue: new FormControl(null)
            }),
            element: null,
            field: null,
            disabled: false
        }
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })

    it('Must equal to empty array', () => {
        expect(component.phones).toEqual([])
    })

    it('Must set only phone numbers', () => {
        const testPhone = '38065484684684'
        const testString = '(#&*@^$(@&*#$(@&*#^$(&*@#^' + testPhone
        component.onPhoneChange(testString, 0)
        expect(component.config.fieldForm.value.fieldValue).toEqual([testPhone])
    })

    it('Must add empty string', () => {
        component.addPhone()
        expect(component.config.fieldForm.value.fieldValue).toContain('')
    })

    it('Must remove phone number', () => {
        component.config.fieldForm.patchValue({
            fieldValue: ['38053486468468']
        })
        const event = jasmine.createSpyObj('event', ['preventDefault', 'stopPropagation'])
        component.removePhone(event, 0)
        expect(component.config.fieldForm.value.fieldValue).toEqual([])
    })

    it('Must toggled overlay panel', () => {
        const event = jasmine.createSpyObj('event', ['preventDefault', 'stopPropagation']);
        spyOn(component.opRef, 'toggle')
        component.toggleOp(event)
        expect(component.opRef.toggle).toHaveBeenCalledTimes(1)
    })
})
