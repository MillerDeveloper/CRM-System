import { Schema } from 'mongoose'

const MessageSchema: Schema<any> = new Schema(
    {
        text: {
            type: String,
            required: function () {
                return (this as any).messageType === 'text'
            },
            minLength: 1,
            maxLength: 10000
        },
        mode: {
            type: String,
            required: true,
            enum: ['basic', 'external'],
            default: 'basic'
        },
        chatRef: {
            type: Schema.Types.ObjectId,
            ref: 'Chat',
            required: true
        },
        messageType: {
            type: String,
            enum: ['text', 'file', 'survey'],
            required: true,
            default: 'text'
        },
        fileType: {
            type: String,
            required: function () {
                return (this as any).messageType === 'file'
            },
            enum: ['image', 'video', 'file']
        },
        files: [],
        answerTo: {
            type: Schema.Types.ObjectId,
            ref: 'Message'
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: function () {
                return (this as any).mode === 'basic'
            },
        },
        companyRef: {
            type: Schema.Types.ObjectId,
            ref: 'Company',
            required: true
        },
        workspaceName: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

export default MessageSchema
