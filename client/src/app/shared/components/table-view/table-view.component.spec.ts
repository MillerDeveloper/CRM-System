import { testCollection, testObjectId, testUser } from '@globalShared/constants/test.constants'
import { TableModule } from 'primeng/table'
import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TableViewComponent } from './table-view.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { TranslateModule } from '@ngx-translate/core'
import { UserService } from '@/shared/services/user/user.service'
import { OverlayPanelModule } from 'primeng/overlaypanel'
import { CollectionService } from '@/shared/services/collection/collection.service'

describe('TableViewComponent', () => {
    let component: TableViewComponent
    let fixture: ComponentFixture<TableViewComponent>
    const fakeUserService = jasmine.createSpyObj('fakeUserService', [
        'hasSystemRight',
        'currentUser'
    ])
    const fakeCollectionService = jasmine.createSpyObj('fakeCollectionService', [
        'getCollectionConfig',
        'getFields',
        'emitData'
    ])

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TableViewComponent],
            imports: [
                HttpClientTestingModule,
                TranslateModule.forRoot(),
                TableModule,
                OverlayPanelModule
            ],
            providers: [
                {
                    provide: UserService,
                    useValue: fakeUserService
                },
                {
                    provide: CollectionService,
                    useValue: fakeCollectionService
                }
            ]
        }).compileComponents()

        fixture = TestBed.createComponent(TableViewComponent)
        component = fixture.componentInstance
        component.config = {
            loadingConfig: {
                isLoadingData: false
            },
            fetchConfig: {
                rows: 5,
                skip: 0,
                totalCount: 0
            },
            collection: testCollection,
            elements: [],
            selection: [],
            isActiveControls: false
        }

        fakeUserService.currentUser = testUser
        fakeUserService.hasSystemRight.and.returnValue(true)
        fakeCollectionService.getFields.and.returnValue([])
        fakeCollectionService.getCollectionConfig.and.returnValue({
            viewOption: {
                _id: testObjectId,
                viewType: 'table',
                fields: []
            }
        })

        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })

    it('should emit on create field', () => {
        spyOn(component.onCreateField, 'emit')
        component.createColumn()
        expect(component.onCreateField.emit).toHaveBeenCalled()
    })

    it('should build filters and fetch data', () => {
        spyOn(component.fetchData, 'emit')
        component.onFetchData({
            filters: {},
            sortField: 'createdAt',
            sortOrder: 1,
            rows: 5,
            first: 0
        })

        expect(component.fetchData.emit).toHaveBeenCalledTimes(1)
    })

    it('should check on default field type', () => {
        expect(component.isDefaultFieldType('number')).toBeTruthy()
    })

    it('should return field label', () => {
        const fieldLabel = 'Test field'
        expect(component.getFieldLabel({ label: fieldLabel })).toEqual(fieldLabel)
    })
})
