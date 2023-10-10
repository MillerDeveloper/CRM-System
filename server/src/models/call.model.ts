import { Schema } from 'mongoose'

const CallSchema: Schema<any> = new Schema(
    {
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
        status: {
            type: String,
            required: true,
            enum: ['answered', 'canceled']
        },
        duration: {
            type: Number,
            required: true
        },
        responseTime: {
            type: Number,
            required: true
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
        callType: {
            type: String,
            required: true,
            enum: ['income', 'outcome']
        },
        calledBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        recordRef: {
            type: Schema.Types.ObjectId,
            ref: 'uploads.files'
        }
    },
    {
        timestamps: true
    }
)

export default CallSchema
