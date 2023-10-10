import { Schema } from 'mongoose'

const CollectionElementSchema: Schema<any> = new Schema(
    {
        collectionRef: {
            type: Schema.Types.ObjectId,
            ref: 'Collection',
            required: true
        },
        workspaceName: {
            type: String,
            required: true,
            immutable: true
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
        info: {
            utm: {
                type: {
                    utm_source: {
                        type: String
                    },
                    utm_medium: {
                        type: String
                    },
                    utm_campaign: {
                        type: String
                    },
                    utm_term: {
                        type: String
                    },
                    utm_content: {
                        type: String
                    }
                }
            }
        },
        deliveries: [
            {
                data: {
                    type: Schema.Types.ObjectId,
                    ref: 'Delivery',
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
        calls: [
            {
                data: {
                    type: Schema.Types.ObjectId,
                    ref: 'Call',
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
        tasks: [
            {
                data: {
                    type: Schema.Types.ObjectId,
                    ref: 'Task',
                    required: true,
                    unique: true
                },
                addedAt: {
                    type: Date,
                    default: Date.now
                },
                addedBy: {
                    type: Schema.Types.ObjectId,
                    ref: 'User',
                    required: true
                }
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
                        },
                        comments: [
                            {
                                text: {
                                    type: String,
                                    required: true
                                },
                                createdBy: {
                                    type: Schema.Types.ObjectId,
                                    ref: 'User',
                                    required: true
                                },
                                createdAt: {
                                    type: Date,
                                    required: true,
                                    default: Date.now
                                }
                            }
                        ]
                    }
                ],
                addedAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ],
        duplicates: {
            type: [
                {
                    createdAt: {
                        type: Date
                    },
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
                    ]
                }
            ],
            default: []
        }
    },
    {
        timestamps: true,
        strict: false
    }
)

const activityCheckFields = ['name']

CollectionElementSchema.pre(['findOneAndUpdate'], async function (doc: any) {
    const modifiedFields: any = this.getUpdate()
    const filter: any = this.getFilter()
})

export default CollectionElementSchema
