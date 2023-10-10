import { Pipe, PipeTransform } from '@angular/core'
import { getFieldValue } from '@globalShared/utils/system.utils'

@Pipe({
    name: 'fieldValue'
})
export class FieldValuePipe implements PipeTransform {
    transform(element: any, field: any): any {
        return getFieldValue(element, field)
    }
}
