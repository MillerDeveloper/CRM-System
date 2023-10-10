import { getFieldValue } from '@globalShared/utils/system.utils'

export function setBarData(config: {
    month: string
    data: { labels: string[]; datasets: any[] }
    element: any
    field: any
}) {
    const monthIndex = config.data.labels.indexOf(config.month)

    if (monthIndex === -1) {
        config.data.labels.push(config.month)
    }

    config.element[config.field._id].forEach((elem: any) => {
        const elemIndex = config.data.datasets.findIndex((el: any) => el._id === elem.data._id)

        if (elemIndex !== -1) {
            config.data.datasets[elemIndex].data[monthIndex] += 1
        } else {
            config.data.datasets.push({
                _id: elem.data._id,
                label: elem.data.name.full,
                data: [1]
            })
        }
    })

    return config.data
}

export function setResponsiblesPerIncome(config: {
    month: string
    data: { labels: string[]; datasets: any[] }
    element: any
    field: any
    value: any
}) {
    const responsibles = getFieldValue(config.element, 'responsibles') || 1
    const monthIndex = config.data.labels.indexOf(config.month)

    if (monthIndex === -1) {
        config.data.labels.push(config.month)
    }

    for (const responsible of responsibles) {
        const elemIndex = config.data.datasets.findIndex(
            (el: any) => el._id === responsible._id
        )

        if (elemIndex !== -1) {
            config.data.datasets[elemIndex].data[monthIndex] += config.value
        } else {
            config.data.datasets.push({
                _id: responsible._id,
                label: responsible.name.full,
                data: [config.value]
            })
        }
    }

    return config.data
}

export function setCountPerMonth(config: {
    month: string
    data: { labels: string[]; datasets: any[] }
}) {
    const countMonthIndex = config.data.labels.indexOf(config.month)
    if (countMonthIndex !== -1) {
        config.data.datasets[0].data[countMonthIndex] += 1
    } else {
        config.data.labels.push(config.month)
        config.data.datasets[0].data.push(1)
    }

    return config.data
}

// Radar
export function setCategoriesData(config: {
    month: string
    data: { labels: string[]; datasets: any[] }
    element: any
    field: any
}) {
    const elFiled = config.element[config.field._id]
    const monthIndex = config.data.labels.indexOf(config.month)

    if (monthIndex === -1) {
        config.data.labels.push(config.month)

        for (let i = 0; i < config.data.datasets.length - 1; i++) {
            config.data.datasets[i].data.push(0)
        }
    }

    if (elFiled.value) {
        for (const category of elFiled.value) {
            const index = config.data.datasets.findIndex(
                (data: any) => data.label === category.label
            )

            if (index !== -1) {
                const lastDataIndex = config.data.datasets[index].data.length - 1
                config.data.datasets[index].data[lastDataIndex] += 1
            } else {
                config.data.datasets.push({
                    label: category.label,
                    data: new Array(config.data.labels.length).fill(0)
                })
            }
        }
    }

    return config.data
}

export function setAgeData(config: {
    month: string
    data: { labels: string[]; datasets: any[] }
    element: any
    field: any
}) {
    const elFiled = config.element[config.field._id]

    if (elFiled.value) {
        const index = config.data.labels.indexOf(config.month)

        if (index !== -1) {
            config.data.datasets[0].data[index] += elFiled.value
        } else {
            config.data.labels.push(config.month)
            for (let i = 0; i < config.data.datasets.length; i++) {
                config.data.datasets[i].data.push(0)
                // config.data.datasets[i].data[i - 1] = config.data.datasets[i].data /
            }
        }
    }

    return config.data
}

export function setCityData(config: {
    month: string
    data: { labels: string[]; datasets: any[] }
    element: any
    field: any
}) {
    const elFiled = config.element[config.field._id]
    const index = config.data.labels.indexOf(elFiled.value)
    if (index !== -1) {
        config.data.datasets[0].data[index] += 1
    } else {
        config.data.labels.push(elFiled.value)
        config.data.datasets[0].data.push(1)
    }

    return config.data
}

export function setCountryData(config: {
    month: string
    data: { labels: string[]; datasets: any[] }
    element: any
    field: any
}) {
    const elFiled = config.element[config.field._id]
    const index = config.data.labels.indexOf(elFiled.value)

    if (index !== -1) {
        config.data.datasets[0].data[index] += 1
    } else {
        config.data.labels.push(elFiled.value)
        config.data.datasets[0].data.push(1)
    }

    return config.data
}

export function setGenderData(config: {
    month: string
    data: { labels: string[]; datasets: any[] }
    element: any
    field: any
}) {
    const elFiled = config.element[config.field._id]
    const index = config.data.labels.indexOf(elFiled.value)

    if (index !== -1) {
        config.data.datasets[0].data[index] += 1
    } else {
        config.data.labels.push(elFiled.value)
        config.data.datasets[0].data.push(1)
    }

    return config.data
}

// labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
// datasets: [
//     {
//         label: 'First Dataset',
//         data: [65, 59, 80, 81, 56, 55, 40],
//         fill: false,
//         borderColor: '#42A5F5',
//         tension: .4
//     },
//     {
//         label: 'Second Dataset',
//         data: [28, 48, 40, 19, 86, 27, 90],
//         fill: false,
//         borderColor: '#FFA726',
//         tension: .4
//     }
// ]
