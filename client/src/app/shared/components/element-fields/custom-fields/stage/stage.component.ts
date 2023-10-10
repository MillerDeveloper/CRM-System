import { OverlayPanel } from 'primeng/overlaypanel'
import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core'
import { ICustomFieldConfig } from '../../element-fields.component'
import { FormGroup } from '@angular/forms'

@Component({
    selector: 'app-stage',
    templateUrl: './stage.component.html',
    styleUrls: ['./stage.component.scss']
})
export class StageComponent {
    @Input() config: ICustomFieldConfig = {
        element: null,
        field: null,
        disabled: true,
        fieldForm: new FormGroup({})
    }
    @ViewChild('opStates') opStatesRef!: OverlayPanel
    @Output() setValue: EventEmitter<any> = new EventEmitter()

    toggleOp(event: any) {
        event.stopImmediatePropagation()

        if (this.config.disabled || this.config.field?.options.length === 0) {
            return
        }

        this.opStatesRef.toggle(event)
    }

    getStage() {
        if (!this.config.field?.options || this.config.field?.options?.length === 0) {
            return
        }

        const stageIndex = this.config.fieldForm?.value.fieldValue?.index
        this.config.field.options.find((option: any) => {
            return option.index === stageIndex
        })
        return this.config.field.options.find((option: any) => option.index === stageIndex)
    }

    setStage(stage: any, index: number) {
        this.config.fieldForm.value.fieldValue = stage
        this.setValue.emit({ value: stage, extraData: { index } })
    }
}
