import { TranslateService } from '@ngx-translate/core'
import { UNITS } from './../../../../../../shared/constants/element.constants'
import { getFieldValue, setFieldValue } from '@globalShared/utils/system.utils'
import { FormControl, FormGroup } from '@angular/forms'
import {
    Component,
    EventEmitter,
    Input,
    Output,
    OnInit,
    ViewChild,
    ChangeDetectionStrategy,
    OnDestroy
} from '@angular/core'
import { Inplace } from 'primeng/inplace'
import { CollectionElementService } from '@/shared/services/collection-element/collection-element.service'
import { UserService } from '@/shared/services/user/user.service'
import { Calendar } from 'primeng/calendar'
import { CURRENCIES, GENDERS } from '@globalShared/constants/element.constants'
import * as moment from 'moment'
import { Subscription } from 'rxjs'

export interface ICustomFieldConfig {
    fieldForm: FormGroup
    element: any
    field: any
    disabled: boolean | undefined
}

@Component({
    selector: 'app-element-fields',
    templateUrl: './element-fields.component.html',
    styleUrls: ['./element-fields.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ElementFieldsComponent implements OnInit, OnDestroy {
    @Input() config!: {
        element: any
        field: any
        index: number
        collection: any
        viewOption?: string
        activated?: boolean
        disabled?: boolean
        defaultStyle?: boolean
    }
    @ViewChild('inplace', { static: false }) inplaceRef!: Inplace
    @ViewChild('calendar', { static: false }) calendarRef!: Calendar
    @Output() updateElement: EventEmitter<any> = new EventEmitter()

    constructor(
        public readonly collectionElementService: CollectionElementService,
        public readonly userService: UserService,
        private readonly translateService: TranslateService
    ) {}

    fieldForm!: FormGroup
    childConfig!: ICustomFieldConfig
    fieldTimeout!: any

    currentUser!: any
    valueChanges$!: Subscription
    readonly genders: any[] = GENDERS
    readonly currencies: any[] = CURRENCIES
    readonly fieldExtraDataOptions: any[] = [
        {
            label: 'Custom',
            value: 'custom'
        },
        {
            label: 'Currency',
            value: 'currency'
        },
        ...UNITS
    ]

    ngOnInit(): void {
        this.currentUser = this.userService.currentUser

        if (this.config?.element) {
            const fieldValue =
                getFieldValue(this.config.element, this.config.field) ??
                this.config.field?.defaultValue

            if (this.config.field.disabled) {
                this.config.disabled = true
            }

            if (!this.config.field.label) {
                this.config.field.label =
                    this.translateService.instant(`fields.${this.config.field._id}`) || 'No name'
            }

            this.fieldForm = new FormGroup({
                fieldValue: new FormControl({
                    value:
                        this.isDateField() && fieldValue && moment(fieldValue, true).isValid()
                            ? moment(fieldValue).toDate()
                            : fieldValue,
                    disabled: this.config.disabled || false
                })
            })

            switch (this.config.field._id) {
                case 'responsibles': {
                    if (!this.hasRight('collections.view', 'allowed')) {
                        this.fieldForm.disable()
                    }
                    break
                }
                default: {
                    if (this.hasRight('collections.edit', 'forbidden')) {
                        this.fieldForm.disable()
                    }
                }
            }

            this.childConfig = {
                fieldForm: this.fieldForm,
                element: this.config.element,
                field: this.config.field,
                disabled: this.config.disabled || this.fieldForm.disabled
            }

            this.valueChanges$ = this.fieldForm.valueChanges.subscribe({
                next: (data: { fieldValue: any }) => {
                    clearTimeout(this.fieldTimeout)
                    this.fieldTimeout = setTimeout(() => {
                        this.setValue(data?.fieldValue)
                    }, 250)
                }
            })
        } else {
            this.fieldForm = new FormGroup({
                fieldValue: new FormControl({
                    value: null,
                    disabled: this.config.disabled || false
                })
            })

            throw new Error('Invalid element')
        }
    }

    getFieldValue(config: { getLabel: boolean } = { getLabel: true }) {
        const value = this.collectionElementService.getGroupedFieldValue(
            this.config.field,
            this.fieldForm.value.fieldValue
        )

        if (!value && config.getLabel) {
            return this.config.field.label
        }

        return value
    }

    getCurrency() {
        return this.collectionElementService.getElementCurrency(this.config.element)
    }

    getUnit() {
        return this.collectionElementService.getElementUnit(this.config.element)
    }

    getTotalPrice() {
        const price = getFieldValue(this.config.element, 'price')
        const discount = getFieldValue(this.config.element, 'discount') || 0
        const quantity = getFieldValue(this.config.element, 'quantity') || 1

        return (price - discount) * quantity || 0
    }

    setValue(value: any, extraData?: any) {
        if (this.isDateField() && moment(value).isValid()) {
            value = moment(value).toDate()
        }

        this.config.element = setFieldValue(this.config.element, this.config.field, value, {
            extraData: extraData
        })

        this.updateElement.emit({
            element: this.config.element,
            index: this.config.index,
            reload: false
        })
    }

    setCustomFieldValue(data: any) {
        this.setValue(data.value, data.extraData)
    }

    isDateField(fieldType: string = this.config.field.fieldType) {
        return ['date', 'datetime'].includes(fieldType)
    }

    getGroupedExtraData(mode: 'prefix' | 'suffix'): string {
        const data = this.getExtraData(mode)
        if (!data) return ''

        switch (mode) {
            case 'prefix': {
                return data + '. '
            }
            case 'suffix': {
                return ' ' + data + '.'
            }
            default: {
                return ''
            }
        }
    }

    getExtraData(mode: 'prefix' | 'suffix') {
        switch (this.config.field[mode]?.identifier) {
            case 'unit':
                return this.getUnit()
            case 'currency':
                return this.getCurrency()
            case 'custom': {
                return this.config.field[mode].value
            }
            default: {
                return ''
            }
        }
    }

    filterGenders(event: any) {
        console.log(event)
    }

    setFieldExtraData(event: any, type: string) {
        switch (event.value) {
            case 'currency': {
                this.config.field[type].identifier = event.value
                break
            }
            default: {
                this.config.field[type].identifier = 'custom'
                this.config.field[type].value = event.value?.code
            }
        }
    }

    hasRight(path: string, mustEqualTo: string) {
        return this.userService.hasSystemRight({
            rightPath: path,
            rights: this.currentUser.rights.system.modules,
            mustEqualTo: mustEqualTo
        })
    }

    getLabel(option: any) {
        const options = this.config.field.options

        if ('_id' in option) {
            const value = options.find((opt: any) => {
                return opt._id === option._id
            })

            if (value) {
                let optionsData: any[] = this.fieldForm.value.fieldValue
                let hasChanges: boolean = false

                if (Array.isArray(optionsData)) {
                    let hasDubles: boolean = false
                    optionsData = optionsData.filter((v: any, i: number, a: any[]) => {
                        const index = a.findIndex((t) => {
                            return t._id === v._id
                        })

                        if (index === i) {
                            return true
                        }

                        hasDubles = true
                        return false
                    })

                    if (hasDubles) {
                        this.fieldForm.patchValue({
                            fieldValue: optionsData
                        })

                        this.setValue(optionsData)
                    }

                    for (let i = 0; i < optionsData.length; i++) {
                        if (
                            optionsData[i]._id === value._id &&
                            optionsData[i].label !== value.label
                        ) {
                            optionsData[i] = value
                            this.fieldForm.patchValue({
                                fieldValue: optionsData
                            })

                            this.setValue(optionsData)
                            hasChanges = true
                        }
                    }
                }

                if (hasChanges) {
                    this.fieldForm.disable()

                    setTimeout(() => {
                        this.fieldForm.enable()
                    }, 100)
                }

                return value.label
            }
        } else {
            return this.config.field.optionLabel
                ? option[this.config.field.optionLabel]
                : option.label
        }
    }

    onInput(event: any) {
        clearTimeout(this.fieldTimeout)

        this.fieldTimeout = setTimeout(() => {
            this.setValue(event.innerText)
        }, 100)
    }

    ngOnDestroy(): void {
        if (this.valueChanges$) {
            this.valueChanges$.unsubscribe()
        }

        clearTimeout(this.fieldTimeout)
    }
}
