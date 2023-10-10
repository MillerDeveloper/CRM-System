import UserSchema from '@/models/user.model'
import { Connection, Model, Schema, connection, Types } from 'mongoose'
import CompanySchema from '@/models/company.model'
import { IRequestData } from '@globalShared/interfaces/system.interface'
import CollectionElementSchema from '@/models/collection/collection-element.model'
import CollectionSchema from '@/models/collection/collection.model'
import { escapeRegExp, isJson, replaceSymbols } from '@globalShared/utils/system.utils'
import TaskSchema from '@/models/task.model'
import NotificationSchema from '@/models/notification.model'
import ChatSchema from '@/models/chat/chat.model'
import MessageSchema from '@/models/chat/message.model'
import CallSchema from '@/models/call.model'
import DeliverySchema from '@/models/delivery.model'
import moment from 'moment'

const schemas: { [key: string]: Schema } = {
    User: UserSchema,
    Company: CompanySchema,
    Collection: CollectionSchema,
    CollectionElement: CollectionElementSchema,
    Task: TaskSchema,
    Notification: NotificationSchema,
    Chat: ChatSchema,
    Message: MessageSchema,
    Call: CallSchema,
    Delivery: DeliverySchema
}

export const defaultFetchConfig = {
    rows: 50,
    page: 0,
    sort: {
        createdAt: 1
    }
}

interface ISchemaFilter {
    [key: string]: any
}

interface IDbConfig {
    connection: Connection | IRequestData
    schemaName: string
    registerSchemas?: string[]
}

export class DBService {
    connection!: Connection
    schema!: Model<any>

    constructor(config: IDbConfig) {
        this.connection = getConnection(config.connection)
        this.schema = this.connection.model(config.schemaName, schemas[config.schemaName])
        config.registerSchemas?.forEach((schema) => this.connection.model(schema, schemas[schema]))
    }

    findMany(
        filter: ISchemaFilter,
        config: {
            populate: any[]
            query: any
            noLimit?: boolean
            select?: any
        } = {
            populate: [],
            query: {}
        }
    ) {
        const { sort, limit, skip } = this.getFindOptions(config.query)
        const schema = this.schema.find(filter).sort(sort)

        if (config.noLimit) {
            return schema.populate(config.populate).select(config.select)
        } else {
            return schema.limit(limit).skip(skip).populate(config.populate).select(config.select)
        }
    }

    findOne(filter: ISchemaFilter, config: { populate: any[]; select?: any } = { populate: [] }) {
        return this.schema.findOne(filter).populate(config.populate).select(config.select)
    }

    create(data: any) {
        return this.schema.create(data)
    }

    updateOne(
        filter: any,
        data: any,
        config: { populate: any[]; select?: any } = { populate: [] }
    ) {
        return this.schema
            .findOneAndUpdate(filter, data, { new: true })
            .populate(config.populate)
            .select(config.select)
    }

    updateMany(
        filter: any,
        data: any,
        config: { populate: any[]; select?: any } = { populate: [] }
    ) {
        return this.schema
            .updateMany(filter, data, { new: true })
            .populate(config.populate)
            .select(config.select)
    }

    deleteOne(filter: any) {
        return this.schema.deleteOne(filter)
    }

    deleteMany(filter: any) {
        return this.schema.deleteMany(filter)
    }

    aggregate(pipeline: any) {
        return this.schema.aggregate(pipeline)
    }

    countDocuments(filter: any) {
        return this.schema.countDocuments(filter)
    }

    getFindOptions(query: any): any {
        let { fetchConfig } = query
        if (isJson(fetchConfig)) {
            fetchConfig = JSON.parse(fetchConfig)

            return {
                sort: fetchConfig.sort || defaultFetchConfig.sort,
                limit: fetchConfig.rows || defaultFetchConfig.rows,
                skip: fetchConfig.skip
            }
        } else {
            return defaultFetchConfig
        }
    }

    getFilters(basicFilter: any = {}, query: any = {}) {
        let bsFilter = basicFilter
        let { fetchConfig, filter } = query

        if (isJson(fetchConfig)) {
            fetchConfig = JSON.parse(fetchConfig)

            if (fetchConfig.filter) {
                Object.keys(fetchConfig.filter).forEach((key: string) => {
                    if (Array.isArray(fetchConfig.filter[key])) {
                        fetchConfig.filter[key].forEach((fl: any) => {
                            const operator = `$${fl.operator}`
                            if (!bsFilter[operator]) {
                                bsFilter[operator] = []
                            }

                            switch (key) {
                                case 'responsibles': {
                                    bsFilter[operator].push({
                                        [`${key}.data`]: {
                                            $in: fl.value
                                        }
                                    })

                                    break
                                }
                                case 'phone': {
                                    bsFilter[operator].push({
                                        [`${key}.value`]: {
                                            $in: fetchConfig.filter[key].map((filter: any) => {
                                                return this.getFilterRegExp(
                                                    fl.matchMode,
                                                    replaceSymbols(filter.value).trim()
                                                )
                                            })
                                        }
                                    })

                                    break
                                }
                                case 'stage': {
                                    bsFilter[operator].push({
                                        [`${key}.value.index`]: {
                                            $in: fetchConfig.filter[key].reduce(
                                                (acc: any[], filter: any) => {
                                                    acc = acc.concat(filter.value)
                                                    return acc
                                                },
                                                []
                                            )
                                        }
                                    })

                                    break
                                }
                                case 'createdAt':
                                case 'updatedAt': {
                                    bsFilter[operator].push({
                                        [key]: this.getFilterRegExp(fl.matchMode, fl.value)
                                    })
                                    break
                                }
                                default: {
                                    bsFilter[operator].push({
                                        [`${key}.value`]: this.getFilterRegExp(
                                            fl.matchMode,
                                            fl.value
                                        )
                                    })
                                }
                            }
                        })
                    } else if (typeof fetchConfig.filter[key] === 'object') {
                        Object.keys(fetchConfig.filter[key]).forEach(() => {
                            switch (key.split('.')[0]) {
                                case 'email':
                                case 'phone': {
                                    bsFilter[key] = {
                                        $in: fetchConfig.filter[key].$in.map(
                                            (value: string) => new RegExp(value, 'g')
                                        )
                                    }
                                    break
                                }
                                default: {
                                    bsFilter[key] = fetchConfig.filter[key]
                                }
                            }
                        })
                    }
                })
            }
        }

        if (isJson(filter)) {
            filter = JSON.parse(filter)
            Object.keys(filter).forEach((key: string) => {
                const splitedKey = key.split('.')

                if (splitedKey.includes('phone')) {
                    filter[key] = new RegExp(filter[key], 'g')
                }

                if (Types.ObjectId.isValid(filter[key])) {
                    filter[key] = new Types.ObjectId(filter[key])
                }
            })

            bsFilter = Object.assign(bsFilter, filter)
        }

        return bsFilter
    }

    getFilterRegExp(mode: string, value: any) {
        if (moment(value, true).isValid() && value.toString().length >= 10) {
            switch (mode) {
                case 'dateBefore': {
                    return { $lte: moment(value).toDate() }
                }
                case 'dateAfter': {
                    return { $gte: moment(value).toDate() }
                }
                case 'dateIs': {
                    return {
                        $gte: moment(value).startOf('day').toDate(),
                        $lte: moment(value).endOf('day').toDate()
                    }
                }
                case 'dateIsNot': {
                    return {
                        $not: {
                            $gte: moment(value).startOf('day').toDate(),
                            $lte: moment(value).endOf('day').toDate()
                        }
                    }
                }
                default: {
                    return {
                        $gte: moment(value).startOf('day').toDate(),
                        $lte: moment(value).endOf('day').toDate()
                    }
                }
            }
        } else {
            value = escapeRegExp(value)

            switch (mode) {
                case 'startsWith':
                    return new RegExp(`^${value}`, 'i')
                case 'endsWith':
                    return new RegExp(`${value}$`, 'i')
                case 'contains':
                    return new RegExp(`${value}`, 'i')
                case 'notContains':
                    return new RegExp(`^((?!${value}).)*$`, 'i')
                case 'equals':
                    return new RegExp(value, 'i')
                case 'notEquals':
                    return new RegExp(`^(?!${value}$).*$`, 'i')
                default:
                    return new RegExp(value, 'i')
            }
        }
    }
}

export function getConnection(incomeConnection: Connection | IRequestData) {
    if (incomeConnection instanceof Connection) {
        return incomeConnection
    } else {
        return connection.useDb(incomeConnection.workspaceName)
    }
}
