import { Schema, Types } from 'mongoose'
import { IField } from '@globalInterfaces/collection.interface'

export const FieldSchema: Schema<IField> = new Schema(
    {
        _id: {
            type: Schema.Types.Mixed,
            required: true,
            unique: true,
            default: Types.ObjectId
        },
        label: {
            type: String,
            trim: true
        },
        optionLabel: {
            type: String
        },
        optionValue: {
            type: String
        },
        fieldType: {
            type: String,
            required: true,
            default: 'text'
        },
        displayType: {
            type: String
        },
        disabled: {
            type: Boolean,
            default: false
        },
        settings: {
            mode: {
                type: String
            },
            prefix: {
                identifier: String,
                value: String
            },
            suffix: {
                identifier: String,
                value: String
            },
            frozen: {
                active: {
                    type: Boolean,
                    default: false
                }
            },
            canDelete: {
                type: Boolean,
                default: true
            },
            setColor: {
                type: Boolean,
                default: false
            }
        },
        usage: {
            element: {
                onCreation: {
                    type: Boolean,
                    default: false
                },
                onConnection: {
                    type: Boolean,
                    default: false
                }
            }
        },
        icon: {
            type: String
        },
        options: [
            {
                label: {
                    type: String,
                    required: true
                },
                color: {
                    type: String
                },
                bgColor: {
                    type: String
                },
                textColor: {
                    type: String
                }
            }
        ],
        defaultValue: {
            type: Schema.Types.Mixed
        },
        collectionRef: {
            type: {
                data: {
                    type: Schema.Types.ObjectId,
                    ref: 'Collection',
                    required: true
                }
            }
        }
    },
    {
        strict: false
    }
)

const CollectionSchema: Schema<any> = new Schema(
    {
        label: {
            text: {
                type: String,
                required: true,
                maxLength: 60
            },
            icon: {
                type: String,
                required: true,
                default: 'pi-bolt'
            },
            iconType: {
                type: String,
                enum: ['emoji', 'icon']
            }
        },
        description: {
            type: String,
            maxLength: 1000
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
        settings: {
            connection: {
                isVisible: {
                    type: Boolean,
                    default: true
                }
            }
        },
        classification: {
            elementsType: {
                type: String,
                required: true,
                enum: ['inanimate', 'lively']
            },
            collectionType: {
                type: String,
                required: true,
                enum: ['leads', 'sales', 'products', 'contacts', 'companies', 'partners', 'custom'],
                default: 'custom'
            }
        },
        viewOptions: {
            type: [
                {
                    label: {
                        type: String
                    },
                    viewType: {
                        type: String,
                        required: true
                    },
                    fields: [FieldSchema]
                }
            ],
            default: [
                {
                    viewType: 'table',
                    fields: []
                },
                {
                    viewType: 'card',
                    fields: []
                }
            ]
        },
        users: [
            {
                _id: false,
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
        ]
    },
    {
        timestamps: true
    }
)

export default CollectionSchema
