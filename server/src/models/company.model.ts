import isUrl from 'validator/lib/isURL'
import { Schema } from 'mongoose'
import { SystemRightsSchema, CollectionsRightsSchema } from './user.model'
import { FieldSchema } from './collection/collection.model'

const CompanySchema: Schema<any> = new Schema(
    {
        name: {
            type: String,
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
        users: [
            {
                element: {
                    type: Schema.Types.ObjectId,
                    ref: 'User',
                    required: true,
                    unique: true
                },
                addedAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ],
        sites: [
            {
                url: {
                    type: String,
                    required: true,
                    validate: [isUrl, 'Invalid url']
                },
                description: {
                    type: String,
                    maxLength: 500
                },
                duplicates: {
                    action: {
                        type: String,
                        required: true,
                        enum: ['deleteOld', 'deleteNew', 'merge', 'nothing']
                    },
                    fields: [FieldSchema]
                },
                distribution: {
                    method: {
                        type: String,
                        required: true,
                        enum: ['random', 'queue', 'workload']
                    },
                    users: [
                        {
                            _id: false,
                            data: {
                                type: Schema.Types.ObjectId,
                                ref: 'User',
                                required: true,
                                unique: true
                            },
                            coefficient: {
                                type: Number,
                                default: 100
                            },
                            lastRecordAt: {
                                type: Date,
                                default: Date.now
                            }
                        }
                    ]
                }
            }
        ],
        integrations: {
            binotel: {
                type: {
                    key: {
                        type: String,
                        required: true,
                        unique: true
                    },
                    secret: {
                        type: String,
                        required: true,
                        unique: true
                    },
                    companyId: {
                        type: String,
                        required: true,
                        unique: true
                    },
                    callNumberType: {
                        type: String,
                        required: true,
                        enum: ['internal', 'external']
                    }
                }
            },
            novaposhta: {
                type: {
                    key: {
                        type: String,
                        required: true,
                        unique: true
                    },
                    sender: {
                        city: {
                            type: Schema.Types.Mixed
                        },
                        contact: {
                            type: String
                        },
                        warehouseType: {
                            type: String
                        },
                        data: {
                            type: Schema.Types.Mixed
                        },
                        address: {
                            type: String
                        }
                    }
                }
            },
            telegram: {
                type: {
                    key: {
                        type: String,
                        required: true,
                        unique: true
                    },
                    welcomeMessage: {
                        type: String,
                        maxlength: 5000
                    },
                    distribution: {
                        method: {
                            type: String,
                            required: true,
                            enum: ['random', 'queue']
                        },
                        users: [
                            {
                                _id: false,
                                data: {
                                    type: Schema.Types.ObjectId,
                                    ref: 'User',
                                    required: true,
                                    unique: true
                                },
                                coefficient: {
                                    type: Number,
                                    default: 100
                                },
                                lastRecordAt: {
                                    type: Date,
                                    default: Date.now
                                }
                            }
                        ]
                    }
                }
            }
        },
        settings: {
            users: {
                departments: [
                    {
                        name: {
                            type: String,
                            required: true
                        },
                        description: {
                            type: String
                        },
                        rights: {
                            system: SystemRightsSchema,
                            collections: [CollectionsRightsSchema]
                        }
                    }
                ]
            }
        },
        info: {
            trial: {
                used: {
                    type: Boolean,
                    default: false
                },
                expiresIn: {
                    type: Date,
                    required: true,
                    default: Date.now
                },
                notifications: {
                    email: {
                        sended: {
                            type: Boolean,
                            default: false
                        },
                        sendedAt: {
                            type: Date
                        }
                    }
                }
            },
            payment: {
                paidAt: {
                    type: Date,
                    required: true,
                    default: Date.now
                },
                expiresIn: {
                    type: Date,
                    required: true,
                    default: Date.now
                },
                notifications: {
                    email: {
                        sended: {
                            type: Boolean,
                            default: false
                        },
                        sendedAt: {
                            type: Date
                        }
                    }
                }
            }
        }
    },
    {
        timestamps: true
    }
)

export default CompanySchema
