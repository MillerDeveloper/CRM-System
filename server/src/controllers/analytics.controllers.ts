import { Types } from 'mongoose'
import { DBService } from '@services/global/db.service'
import { serverError } from '@/utils/error-handler.util'
import { Router, Request, Response } from 'express'
import passport from 'passport'
import { getAllElementFields } from '@globalShared/utils/collection.utils'
import { RESPONSIBLES_POPULATE } from '@/shared/constants/db.constants'
import moment from 'moment'
import {
    setAgeData,
    setBarData,
    setCategoriesData,
    setCityData,
    setCountPerMonth,
    setCountryData,
    setGenderData,
    setResponsiblesPerIncome
} from '@/utils/analytics.utils'
import { getFieldValue } from '@globalShared/utils/system.utils'

const router = Router()

router.get(
    '/:collectionId',
    passport.authenticate('jwt', { session: false }),
    async (req: Request, res: Response) => {
        try {
            if (Types.ObjectId.isValid(req.params.collectionId)) {
                const collectionId = new Types.ObjectId(req.params.collectionId)
                const collectionService = new DBService({
                    connection: req.user,
                    schemaName: 'Collection'
                })

                const collectionElementsService = new DBService({
                    connection: req.user,
                    schemaName: 'CollectionElement',
                    registerSchemas: ['User']
                })

                const collection = await collectionService.findOne({
                    companyRef: new Types.ObjectId(req.user.companyId),
                    _id: collectionId
                })

                if (!collection) {
                    return res.status(400).json({
                        message: 'Invalid collection id'
                    })
                }

                const fields = getAllElementFields(collection.viewOptions)
                const filter = collectionService.getFilters(
                    {
                        companyRef: new Types.ObjectId(req.user.companyId),
                        collectionRef: collectionId
                    },
                    req.query
                )

                const collectionElements = await collectionElementsService.findMany(filter, {
                    populate: [RESPONSIBLES_POPULATE],
                    query: req.query,
                    noLimit: true
                })

                const totalCount = await collectionElementsService.countDocuments(filter)
                const counter: any = {
                    price: 0,
                    discount: 0,
                    age: 0
                }

                console.log('totalCount', totalCount)

                const data: any = {
                    count: {
                        total: totalCount,
                        failures: 0,
                        success: 0,
                        undecided: 0,
                        income: 0,
                        averagePrice: 0,
                        averageDiscount: 0,
                        averageAge: 0,
                        topFivePrice: 0
                    },
                    responsibles: {
                        labels: [],
                        datasets: []
                    },
                    responsiblesPerIncome: {
                        labels: [],
                        datasets: []
                    },
                    categories: {
                        labels: [],
                        datasets: []
                    },
                    countPerMonth: {
                        labels: [],
                        datasets: [
                            {
                                label: 'Categories',
                                data: []
                            }
                        ]
                    },
                    cities: {
                        labels: [],
                        datasets: [
                            {
                                label: 'Count',
                                data: []
                            }
                        ]
                    },
                    genders: {
                        labels: [],
                        datasets: [
                            {
                                label: 'Count',
                                data: []
                            }
                        ]
                    },
                    countries: {
                        labels: [],
                        datasets: [
                            {
                                label: 'Count',
                                data: []
                            }
                        ]
                    }
                }

                for (const element of collectionElements) {
                    const month = moment(element.createdAt).format('MMMM')

                    data.countPerMonth = setCountPerMonth({
                        data: data.countPerMonth,
                        month: month
                    })

                    for (const field of fields) {
                        const elField: { value: any } = element[field._id]

                        if (field._id in element) {
                            const defaultConfig = {
                                month: month,
                                element: element,
                                field: field
                            }

                            switch (field._id) {
                                case 'stage': {
                                    if (elField.value?.index === 0) {
                                        data.failures += 1
                                    } else if (elField.value?.index === field.options.length - 1) {
                                        data.success += 1
                                    } else {
                                        data.undecided += 1
                                    }

                                    break
                                }
                                case 'responsibles': {
                                    data.responsibles = setBarData({
                                        ...defaultConfig,
                                        data: data.responsibles
                                    })

                                    break
                                }
                                case 'categories': {
                                    data.categories = setCategoriesData({
                                        ...defaultConfig,
                                        data: data.categories
                                    })

                                    break
                                }
                                case 'price': {
                                    if (element[field._id].value) {
                                        const discount = getFieldValue(element, 'discount') || 0
                                        const quantity = getFieldValue(element, 'quantity') || 1

                                        data.count.averagePrice += element[field._id].value
                                        data.count.income +=
                                            (element[field._id].value || 0 - discount) * quantity ||
                                            0

                                        data.responsiblesPerIncome = setResponsiblesPerIncome({
                                            ...defaultConfig,
                                            value: data.count.income,
                                            data: data.responsiblesPerIncome
                                        })

                                        counter.price++
                                    }

                                    break
                                }
                                case 'discount': {
                                    if (element[field._id].value) {
                                        data.count.averageDiscount += element[field._id].value
                                        counter.discount++
                                    }

                                    break
                                }
                                case 'age': {
                                    if (element[field._id].value) {
                                        data.count.averageAge += element[field._id].value
                                        counter.age++
                                    }

                                    break
                                }
                                case 'city': {
                                    data.cities = setCityData({
                                        ...defaultConfig,
                                        data: data.cities
                                    })

                                    break
                                }
                                case 'country': {
                                    data.countries = setCountryData({
                                        ...defaultConfig,
                                        data: data.countries
                                    })

                                    break
                                }
                                case 'gender': {
                                    data.genders = setGenderData({
                                        ...defaultConfig,
                                        data: data.genders
                                    })

                                    break
                                }
                            }
                        }
                    }
                }

                data.count.averagePrice = data.count.averagePrice / counter.price
                data.count.averageDiscount = data.count.averageDiscount / counter.discount
                data.count.averageAge = Math.floor(data.count.averageAge / counter.age)

                res.status(200).json({
                    data: data
                })
            } else {
                res.status(400).json({
                    message: 'Invalid collection id'
                })
            }
        } catch (error) {
            serverError(res, error)
        }
    }
)

// Количество заявок за период
// Количество отказов
// Количество успешных
// Количество подвешенных

// Количестов заявок к менеджерам - horizontal bar
// Количестов заявок к месяцам - horizontal bar

// Количестов заявок к категориям - radar
// Общаяя прибыль (если есть колонка)
// Средняя цена (если есть колонка)
// Средняя скидка (если есть колонка)
// Средняий возраст (если есть колонка)
// Количество заявок к городам (если есть колонка) - pie
// Количество заявок к странам (если есть колонка) - pie

// -- !!!!
// Количестов заявок к полу - pie
// Количестов заявок к возрасту - doughnut
// -- !!!!

// Топ 5 по стоимости заказа (если есть колонка) - horizontal bar
// Топ 5 по скидкам (если есть колонка) - horizontal bar
// Топ 5 по закупочным ценам (если есть колонка) - horizontal bar

export default router
