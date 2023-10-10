import { Component, OnInit } from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog'

@Component({
    selector: 'app-field-controls',
    templateUrl: './field-controls.component.html',
    styleUrls: ['./field-controls.component.scss']
})
export class FieldControlsComponent implements OnInit {
    constructor(
        public readonly ref: DynamicDialogRef,
        public readonly config: DynamicDialogConfig
    ) {}

    modalMode!: string
    fieldOptions: any[] = [{}]
    collection!: any

    findedField!: any

    fieldForm: FormGroup = new FormGroup({
        _id: new FormControl(null),
        label: new FormControl(null, Validators.required),
        fieldType: new FormControl('text', Validators.required),
        description: new FormControl(null),
        displayType: new FormControl(null),
        defaultValue: new FormControl(null),
        optionLabel: new FormControl(null),
        optionValue: new FormControl(null),
        index: new FormControl(null),
        disabled: new FormControl(false),
        options: new FormControl([]),
        icon: new FormControl(null),
        usage: new FormGroup({
            element: new FormGroup({
                onCreation: new FormControl(false),
                onConnection: new FormControl(false)
            })
        }),
        settings: new FormGroup({
            mode: new FormControl(null),
            value: new FormControl(null),
            setColor: new FormControl(false),
            prefix: new FormGroup({
                identifier: new FormControl(null),
                value: new FormControl(null)
            }),
            suffix: new FormGroup({
                identifier: new FormControl(null),
                value: new FormControl(null)
            }),
            canDelete: new FormControl(false)
        })
    })

    readonly fieldTypes: any[] = [
        {
            label: 'Text',
            value: 'text'
        },
        {
            label: 'Textarea',
            value: 'textarea'
        },
        {
            label: 'Number',
            value: 'number'
        },
        {
            label: 'Checkbox',
            value: 'checkbox'
        },
        {
            label: 'Date',
            value: 'date'
        },
        {
            label: 'Date and time',
            value: 'datetime'
        },
        {
            label: 'Rating',
            value: 'rating'
        },
        {
            label: 'Select',
            value: 'select'
        },
        {
            label: 'Multi-select',
            value: 'multiselect'
        },
        {
            label: 'Currency',
            value: 'currency'
        },
        {
            label: 'Slider',
            value: 'slider'
        }
    ]

    modes: any[] = [
        {
            label: 'Decimal',
            value: 'decimal'
        },
        {
            label: 'Currency',
            value: 'currency'
        }
    ]
    prefixes: any[] = [
        {
            label: 'Unit',
            value: 'unit'
        },
        {
            label: 'Currency',
            value: 'currency'
        },
        {
            label: 'Custom',
            value: 'custom'
        }
    ]

    ngOnInit(): void {
        if (this.config.data) {
            this.modalMode = this.config.data.modalMode
            this.collection = this.config.data.collection

            switch (this.modalMode) {
                case 'update': {
                    this.fieldForm.patchValue(this.config.data.field)
                    this.fieldOptions = this.config.data.field.options
                    break
                }
            }
        }
    }

    close() {
        this.fieldForm.get('suffix.identifier')?.enable()

        const data = this.fieldForm.value
        switch (this.fieldForm.value.fieldType) {
            case 'multiselect':
            case 'select': {
                this.fieldForm.value.optionValue = 'label'
                break
            }
        }

        if (this.modalMode !== 'update') {
            delete data._id
        }

        this.ref.close({
            data: this.fieldForm.value,
            mode: 'field'
        })
    }

    createOption() {
        if (this.fieldForm.value._id === 'stage') {
            this.fieldOptions.push({
                label: '',
                index: this.fieldOptions.length
            })
        } else {
            this.fieldOptions.push({
                label: ''
            })
        }
    }

    stopPropagation(event: any) {
        event.stopImmediatePropagation()
    }

    onSettingOption(option: any) {}

    deleteOption(option: any) {
        const index = this.fieldForm.value.options.findIndex(
            (opt: any) => opt.label === option.label
        )
        if (index !== -1) [this.fieldForm.value.options.splice(index, 1)]
    }

    onModeChange() {
        if (this.fieldForm.value.settings.mode === 'currency') {
            this.fieldForm.patchValue({
                suffix: {
                    identifier: null
                }
            })

            this.fieldForm.get('suffix.identifier')?.disable()
        } else {
            this.fieldForm.get('suffix.identifier')?.enable()
        }
    }
}
