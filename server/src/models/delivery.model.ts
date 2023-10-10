import { Schema } from 'mongoose'

const DeliverySchema: Schema<any> = new Schema(
    {
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            immutable: true
        },
        companyRef: {
            type: Schema.Types.ObjectId,
            ref: 'Company',
            required: true,
            immutable: true
        },
        workspaceName: {
            type: String,
            required: true,
            immutable: true
        },
        connection: {
            to: {
                type: Schema.Types.ObjectId,
                required: true,
                refPath: 'connection.model'
            },
            model: {
                type: String,
                required: true,
                enum: ['CollectionElement']
            },
            collectionRef: {
                type: Schema.Types.ObjectId,
                ref: 'Collection',
                required: true
            }
        },
        waybill: {
            tracker: {
                type: String,
                unique: true,
                required: true
            },
            service: {
                type: String,
                enum: ['novaposhta'],
                required: true
            }
        },
        cost: {
            amount: {
                type: Number
            },
            currency: {
                type: String
            }
        },
        deliveryAt: {
            type: Date
        }
    },
    {
        timestamps: true
    }
)

export default DeliverySchema
