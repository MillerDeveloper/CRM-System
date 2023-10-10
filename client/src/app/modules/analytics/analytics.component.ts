import { AnalyticsService } from '@/shared/services/analytics/analytics.service'
import { CollectionService } from '@/shared/services/collection/collection.service'
import { Component, OnInit } from '@angular/core'
import * as moment from 'moment'

@Component({
    selector: 'app-analytics',
    templateUrl: './analytics.component.html',
    styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {
    constructor(
        private readonly analyticsService: AnalyticsService,
        private readonly collectionService: CollectionService
    ) {}


    horizontalOptions = {
        indexAxis: 'y',
        plugins: {
            legend: {
                labels: {
                    color: '#495057'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            },
            y: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            }
        }
    }

    basicOptions: any = {
        plugins: {
            legend: {
                labels: {
                    color: '#495057'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            },
            y: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            }
        }
    }

    data: any = {
        count: {}
    }
    filterData: any = {
        createdAt: {
            $gte: moment().subtract(6, 'months').startOf('day').toDate(),
            $lte: moment().endOf('day').toDate()
        }
    }
    collections: any[] = []
    selectedCollectionId!: string

    ngOnInit(): void {
        this.fetchCollections()
    }

    fetchCollections() {
        this.collectionService.findAll({}).subscribe({
            next: (response: { collections: any[] }) => {
                if (response.collections?.length > 0) {
                    this.collections = response.collections
                    this.selectedCollectionId = response.collections[0]._id
                    this.fetchByCollection()
                }
            }
        })
    }

    fetchByCollection() {
        this.analyticsService
            .fetchByCollection(this.selectedCollectionId, this.filterData)
            .subscribe({
                next: (response: { data: any }) => {
                    this.data = response.data
                }
            })
    }

    onCollectionChange(event: any) {
        this.selectedCollectionId = this.collections[event.index]._id
        this.fetchByCollection()
    }

    filter(event: any) {
        this.filterData = {
            ...this.filterData,
            ...event
        }

        this.fetchByCollection()
    }
}
