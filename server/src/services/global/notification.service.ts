import { IRequestData } from '@globalShared/interfaces/system.interface'
import { Types } from 'mongoose'
import { DBService } from './db.service'

export class NotificationService {
    constructor() {}

    async create(connectedElement: any, schemaName: string) {
        const requestData: IRequestData = this.getRequestData(connectedElement)
        const notification = this.getNotificationData(connectedElement, schemaName)
        const { workspaceName, companyRef, collectionRef } = connectedElement

        await new DBService({ connection: requestData, schemaName: 'Notification' }).create({
            ...notification,
            workspaceName: workspaceName,
            companyRef: companyRef,
            connection: {
                to: new Types.ObjectId(connectedElement._id),
                model: schemaName,
                collectionRef: collectionRef
            }
        })
    }

    async updateOne(connectedElement: any, schemaName: string) {
        const requestData: IRequestData = this.getRequestData(connectedElement)
        const notification = this.getNotificationData(connectedElement, schemaName)

        await new DBService({ connection: requestData, schemaName: 'Notification' }).updateOne(
            { ['connection.to']: new Types.ObjectId(connectedElement._id) },
            notification
        )
    }

    async deleteOne(connectedElement: any) {
        const requestData: IRequestData = this.getRequestData(connectedElement)
        await new DBService({ connection: requestData, schemaName: 'Notification' }).deleteOne({
            ['connection.to']: new Types.ObjectId(connectedElement._id)
        })
    }

    getNotificationData(element: any, schemaName: string) {
        switch (schemaName) {
            default: {
                return {
                    title: element.title,
                    notifyAt: element.startAt || element.endAt,
                    responsibles: element.responsibles
                }
            }
        }
    }

    getRequestData(element: any) {
        return {
            workspaceName: element.workspaceName,
            companyId: element.companyRef,
            userId: element.createdBy
        }
    }
}
