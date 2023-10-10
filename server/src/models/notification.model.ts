import { Schema } from 'mongoose'

const NotificationSchema: Schema<any> = new Schema(
    {
        title: {
            type: String,
            required: true,
            maxLength: 1000
        },
        notifyAt: {
            type: Date,
            required: true
        },
        companyRef: {
            type: Schema.Types.ObjectId,
            ref: 'Company',
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
                enum: ['Task', 'CollectionElement']
            },
            collectionRef: {
                type: Schema.Types.ObjectId,
                ref: 'Collection'
            }
        },
        workspaceName: {
            type: String,
            required: true,
            immutable: true
        },
        responsibles: [
            {
                _id: false,
                data: {
                    type: Schema.Types.ObjectId,
                    ref: 'User',
                    required: true,
                    unique: true
                },
                isNotified: {
                    type: Boolean,
                    default: false
                }
            }
        ]
    },
    {
        timestamps: true
    }
)

export default NotificationSchema
