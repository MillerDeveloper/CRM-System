export interface ILoadingConfig {
    isLoadingData: boolean
    isFirstLoad?: boolean
}

export interface ITableConfig {
    loadingConfig: ILoadingConfig
    fetchConfig: IFetchConfig
    collection: any
    elements: any[]
    selection: any[]
    isActiveControls: boolean
}

export interface IToolbarConfig {
    loadingConfig: ILoadingConfig
    collection: any
    selection: any[]
    search?: string
}

export interface IFilter {
    field: string
    matchMode: string
    value: any
}

export interface IColumn {
    _id: string
    label: string
}

export interface IFetchConfig {
    filter?: any
    sort?: any
    rows: number
    skip: number
    totalCount: number
    search?: string
}
