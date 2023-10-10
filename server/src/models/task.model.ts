import { NotificationService } from '@services/global/notification.service'
import { Schema } from 'mongoose'

const TaskSchema: Schema<any> = new Schema(
    {
        title: {
            type: String,
            required: true,
            maxLength: 1000
        },
        description: {
            type: String,
            maxLength: 1000
        },
        startAt: {
            type: Date
        },
        endAt: {
            type: Date
        },
        period: {
            type: String
        },
        stage: {
            progress: {
                type: String,
                enum: ['notCompleted', 'paused', 'completed'],
                default: 'notCompleted'
            },
            startAt: {
                type: Date
            },
            completedAt: {
                type: Date
            }
        },
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
        checklists: [
            {
                label: {
                    type: String,
                    required: true
                },
                checkboxes: [
                    {
                        label: {
                            type: String,
                            required: true
                        },
                        complete: {
                            stage: {
                                type: Boolean,
                                default: false
                            }
                        }
                    }
                ]
            }
        ],
        responsibles: [
            {
                _id: false,
                data: {
                    type: Schema.Types.ObjectId,
                    ref: 'User',
                    required: true,
                    unique: true
                }
            }
        ],
        executors: [
            {
                _id: false,
                data: {
                    type: Schema.Types.ObjectId,
                    ref: 'User',
                    required: true,
                    unique: true
                }
            }
        ],
        files: [
            {
                data: {
                    type: Schema.Types.ObjectId,
                    ref: 'uploads.files',
                    required: true,
                    unique: true
                },
                addedBy: {
                    type: Schema.Types.ObjectId,
                    ref: 'User',
                    required: true
                }
            }
        ],
        connections: [
            {
                _id: false,
                collectionRef: {
                    type: Schema.Types.ObjectId,
                    required: true,
                    unique: true,
                    ref: 'Collection'
                },
                elements: [
                    {
                        _id: false,
                        data: {
                            type: Schema.Types.ObjectId,
                            ref: 'CollectionElement',
                            required: true,
                            unique: true
                        }
                    }
                ],
                addedAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ]
    },
    {
        timestamps: true
    }
)

TaskSchema.post('save', async function (document: any) {
    await new NotificationService().create(document, 'Task')
})

TaskSchema.post('findOneAndUpdate', async function (document: any) {
    await new NotificationService().updateOne(document, 'Task')
})

TaskSchema.pre(['deleteOne', 'deleteMany', 'findOneAndDelete'], async function () {
    const documents = await this.model.find(this.getFilter())

    for (const doc of documents) {
        await new NotificationService().deleteOne(doc)
    }
})

export default TaskSchema
