import { Schema } from 'mongoose'

const ChatSchema: Schema<any> = new Schema(
    {
        chatType: {
            type: String,
            required: function () {
                return (this as any).mode !== 'connected'
            },
            enum: ['single', 'group']
        },
        mode: {
            type: String,
            required: true,
            enum: ['connected', 'basic', 'external']
        },
        externalConfig: {
            service: {
                type: String,
                enum: ['telegram'],
                required: function () {
                    return (this as any).mode === 'external'
                }
            },
            identifier: {
                type: String,
                required: function () {
                    return (this as any).mode === 'external'
                }
            }
        },
        connection: {
            to: {
                type: Schema.Types.ObjectId,
                required: function () {
                    return (this as any).mode === 'connected'
                },
                refPath: 'connection.model'
            },
            model: {
                type: String,
                required: function () {
                    return (this as any).mode === 'connected'
                },
                enum: ['Task', 'CollectionElement']
            },
            collectionRef: {
                type: Schema.Types.ObjectId,
                ref: 'Collection'
            }
        },
        chatWith: {
            type: [
                {
                    data: {
                        type: Schema.Types.ObjectId,
                        ref: 'User',
                        required: function () {
                            return (this as any).mode !== 'external'
                        },
                        unique: true
                    }
                }
            ]
        },
        createdBy: {
            data: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: function () {
                    return (this as any).mode !== 'external'
                }
            },
            name: {
                first: String,
                username: String
            }
        },
        companyRef: {
            type: Schema.Types.ObjectId,
            ref: 'Company',
            required: true
        },
        workspaceName: {
            type: String,
            required: true
        },
        messages: {
            type: [
                {
                    _id: false,
                    data: {
                        type: Schema.Types.ObjectId,
                        ref: 'Message',
                        required: true,
                        unique: true
                    },
                    addedAt: {
                        type: Date,
                        default: Date.now
                    }
                }
            ],
            default: []
        }
    },
    {
        timestamps: true
    }
)

export default ChatSchema
