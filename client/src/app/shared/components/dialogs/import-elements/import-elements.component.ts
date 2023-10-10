import { CollectionElementService } from '@/shared/services/collection-element/collection-element.service'
import { Component, OnInit } from '@angular/core'
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog'
import * as XLSX from 'xlsx'

@Component({
    selector: 'app-import-elements',
    templateUrl: './import-elements.component.html',
    styleUrls: ['./import-elements.component.scss']
})
export class ImportElementsComponent implements OnInit {
    constructor(
        public readonly ref: DynamicDialogRef,
        public readonly config: DynamicDialogConfig,
        private readonly collectionElementService: CollectionElementService
    ) {}

    columns: any[] = []
    fileData!: any
    dictionary: any = {}
    newElements: any[] = []
    state: any = {
        isUploadedFile: false,
        isSelectedFields: false
    }

    ngOnInit(): void {}

    uploadFiles(file: any) {
        const reader: FileReader = new FileReader()

        reader.onload = (e: any) => {
            const bstr: string = e.target.result
            const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' })

            const wsname: string = wb.SheetNames[0]
            const ws: XLSX.WorkSheet = wb.Sheets[wsname]

            this.fileData = XLSX.utils.sheet_to_json(ws, { header: 1 })
            this.columns = this.fileData.shift()
            this.columns = this.columns.reduce((acc: any[], column: any) => {
                acc.push({
                    label: column,
                    selectedField: null
                })
                return acc
            }, [])

            this.state.isUploadedFile = true
        }

        reader.readAsBinaryString(file)
    }

    removeColumn(column: any) {
        const index = this.columns.findIndex((clmn: any) => clmn.label === column.label)
        if (index !== -1) {
            this.columns.splice(index, 1)
        }
    }

    nextStep() {
        if (this.state.isSelectedFields) {
            this.tryCompareFields()
        } else {
            this.state.isSelectedFields = true
            this.tryCompareFields()
        }

        console.log(this.state)
    }

    getDictionaryArray(): any {
        return Object.keys(this.dictionary)
    }

    tryCompareFields() {
        if (this.fileData) {
            this.newElements = []
            const fileData = this.fileData.filter((data: any[]) => data.length > 0)

            fileData.forEach((value: any[]) => {
                const element: any = {
                    collectionRef: this.config.data.collection._id
                }

                this.columns.forEach((column: any, index: number) => {
                    const dataValue = value[index]

                    if (column.selectedField) {
                        switch (column.selectedField.fieldType) {
                            case 'select':
                            case 'multiselect': {
                                const dictionaryElementData: any = {
                                    [`${dataValue}`]: null,
                                    fieldLabel: dataValue,
                                    selectedField: column.selectedField
                                }

                                if (this.dictionary[column.selectedField._id]) {
                                    const value = this.dictionary[column.selectedField._id].find(
                                        (item: any) => !!item[`${dataValue}`]
                                    )

                                    if (value) {
                                        element[column.selectedField._id] = {
                                            value: value[`${dataValue}`]
                                        }
                                    } else {
                                        this.dictionary[column.selectedField._id].push(
                                            dictionaryElementData
                                        )
                                    }
                                } else {
                                    this.dictionary[column.selectedField._id] = [
                                        dictionaryElementData
                                    ]
                                }
                                break
                            }
                            default: {
                                element[column.selectedField._id] = dataValue
                            }
                        }
                    }
                })

                this.newElements.push(element)
            })

            if (this.isDictionaryFilled()) {
                this.close()
            }
        }
    }

    isDictionaryFilled(): boolean {
        let isFiledDictionary = true
        const dictionaryKeysArray = Object.keys(this.dictionary)

        if (dictionaryKeysArray.length > 0) {
            dictionaryKeysArray.forEach((key: string) => {
                this.dictionary[key].forEach((dictionaryElement: any) => {
                    if (!dictionaryElement[dictionaryElement.fieldLabel]) {
                        isFiledDictionary = false
                    }
                })
            })

            return isFiledDictionary
        }

        return true
    }

    close() {
        this.ref.close({
            elements: this.newElements
        })
    }
}
