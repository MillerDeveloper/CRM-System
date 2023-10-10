import { environment } from './../shared/enviroment'
import { RIGHT_SELECTION } from './../../../shared/constants/system.constants'
import isUrl from 'validator/lib/isURL'
import { SYSTEM_LANGS } from '@globalShared/constants/system.constants'
import isStrongPassword from 'validator/lib/isStrongPassword'
import { compare } from 'bcryptjs'
import { Schema } from 'mongoose'
import isEmail from 'validator/lib/isEmail'
import { IUser } from '@globalShared/interfaces/user.interface'
import { hasSystemRight } from '@globalShared/utils/system.utils'

export interface IUserDocument extends IUser {
    save: () => Promise<any>
    comparePassword: (password: string) => Promise<boolean>
    hasRight: (args: string, requiredRight: unknown) => boolean | string | Array<unknown>
}

export const SystemRightsSchema: Schema<any> = new Schema({
    access: {
        entrance: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    modules: {
        tasks: {
            create: {
                type: Boolean,
                required: true,
                default: false
            },
            view: {
                type: String,
                required: true,
                enum: RIGHT_SELECTION,
                default: 'forbidden'
            },
            edit: {
                type: String,
                required: true,
                enum: RIGHT_SELECTION,
                default: 'forbidden'
            },
            complete: {
                type: String,
                required: true,
                enum: RIGHT_SELECTION,
                default: 'forbidden'
            },
            delete: {
                type: String,
                required: true,
                enum: RIGHT_SELECTION,
                default: 'forbidden'
            }
        },
        settings: {
            createCompany: {
                type: Boolean,
                required: true,
                default: false
            },
            settingCompany: {
                type: Boolean,
                required: true,
                default: false
            },
            users: {
                invite: {
                    type: Boolean,
                    required: true,
                    default: false
                },
                create: {
                    type: Boolean,
                    required: true,
                    default: false
                },
                view: {
                    type: String,
                    required: true,
                    enum: RIGHT_SELECTION,
                    default: 'forbidden'
                },
                delete: {
                    type: String,
                    required: true,
                    enum: RIGHT_SELECTION,
                    default: 'forbidden'
                }
            },
            integrations: {
                edit: {
                    type: String,
                    required: true,
                    enum: RIGHT_SELECTION,
                    default: 'forbidden'
                }
            },
            sites: {
                edit: {
                    type: String,
                    required: true,
                    enum: RIGHT_SELECTION,
                    default: 'forbidden'
                }
            }
        },
        collections: {
            create: {
                type: Boolean,
                required: true,
                default: false
            },
            view: {
                type: String,
                required: true,
                enum: RIGHT_SELECTION,
                default: 'forbidden'
            },
            edit: {
                type: String,
                required: true,
                enum: RIGHT_SELECTION,
                default: 'forbidden'
            },
            delete: {
                type: String,
                required: true,
                enum: RIGHT_SELECTION,
                default: 'forbidden'
            }
        },
        analytics: {
            view: {
                type: String,
                required: true,
                enum: RIGHT_SELECTION,
                default: 'forbidden'
            }
        },
        mail: {
            send: {
                type: Boolean,
                required: true,
                default: false
            },
            view: {
                type: String,
                required: true,
                enum: RIGHT_SELECTION,
                default: 'forbidden'
            },
            delete: {
                type: String,
                required: true,
                enum: RIGHT_SELECTION,
                default: 'forbidden'
            }
        },
        files: {
            upload: {
                type: Boolean,
                required: true,
                default: false
            },
            view: {
                type: String,
                required: true,
                enum: RIGHT_SELECTION,
                default: 'forbidden'
            },
            delete: {
                type: String,
                required: true,
                enum: RIGHT_SELECTION,
                default: 'forbidden'
            }
        },
        deliveries: {
            create: {
                type: Boolean,
                required: true,
                default: false
            },
            view: {
                type: String,
                required: true,
                enum: RIGHT_SELECTION,
                default: 'forbidden'
            },
            delete: {
                type: String,
                required: true,
                enum: RIGHT_SELECTION,
                default: 'forbidden'
            }
        },
        calls: {
            create: {
                type: Boolean,
                required: true,
                default: false
            },
            view: {
                type: String,
                required: true,
                enum: RIGHT_SELECTION,
                default: 'forbidden'
            },
            delete: {
                type: String,
                required: true,
                enum: RIGHT_SELECTION,
                default: 'forbidden'
            }
        }
    }
})

export const CollectionsRightsSchema: Schema<any> = new Schema({
    collectionRef: {
        type: Schema.Types.ObjectId,
        ref: 'Collection',
        required: true,
        unique: true
    },
    rights: {
        create: {
            type: Boolean,
            required: true,
            default: false
        },
        view: {
            type: String,
            required: true,
            enum: RIGHT_SELECTION
        },
        edit: {
            type: String,
            required: true,
            enum: RIGHT_SELECTION
        },
        delete: {
            type: String,
            required: true,
            enum: RIGHT_SELECTION
        },
        import: {
            type: Boolean,
            required: true,
            default: false
        },
        export: {
            type: Boolean,
            required: true,
            default: false
        }
    }
})

const UserSchema: Schema<any> = new Schema(
    {
        avatar: {
            type: {
                fileRef: {
                    type: Schema.Types.ObjectId,
                    ref: 'uploads.files',
                    required: true,
                    unique: true
                },
                url: {
                    type: String,
                    required: true,
                    validate: [isUrl, 'Not a valid URL']
                }
            }
        },
        name: {
            first: String,
            last: String,
            full: String
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            validate: [isEmail, 'Invalid Email']
        },
        workspaceName: {
            type: String,
            required: true,
            immutable: true
        },
        companies: [
            {
                element: {
                    type: Schema.Types.ObjectId,
                    ref: 'Company',
                    required: true,
                    unique: true
                },
                addedAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ],
        rights: {
            system: SystemRightsSchema,
            collections: [CollectionsRightsSchema]
        },
        departments: [
            {
                _id: false,
                departmentRef: {
                    type: Schema.Types.ObjectId,
                    required: true,
                    unique: true
                },
                addedAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ],
        info: {
            register: {
                method: {
                    type: String,
                    required: true,
                    enum: ['invitation', 'self', 'trial'],
                    default: 'self'
                },
                invitation: {
                    type: {
                        accepted: {
                            type: Boolean,
                            default: false
                        },
                        invitedBy: {
                            type: Schema.Types.ObjectId,
                            ref: 'User',
                            required: true
                        },
                        invitedAt: {
                            type: Date,
                            default: Date.now
                        }
                    }
                }
            },
            language: {
                code: {
                    type: String,
                    required: true,
                    enum: SYSTEM_LANGS,
                    default: 'en'
                }
            },
            location: {
                timezone: {
                    type: String,
                    required: true,
                    default: Intl.DateTimeFormat().resolvedOptions().timeZone
                }
            },
            theme: {
                mode: {
                    type: String,
                    enum: ['dark', 'light'],
                    required: true,
                    default: 'dark'
                }
            },
            system: {
                release: {
                    version: {
                        type: String,
                        required: true,
                        default: environment.version
                    }
                }
            }
        },
        settings: {
            notifications: {
                push: {
                    subscription: {
                        type: {
                            endpoint: {
                                type: String,
                                required: true
                            },
                            expirationTime: Date,
                            keys: {
                                p256dh: {
                                    type: String,
                                    required: true
                                },
                                auth: {
                                    type: String,
                                    required: true
                                }
                            }
                        }
                    }
                }
            }
        },
        integrations: {
            type: {
                _id: false,
                mail: [
                    {
                        email: {
                            type: String,
                            required: true,
                            unique: true,
                            validate: [isEmail, 'Not valid email']
                        },
                        avatar: {
                            url: {
                                type: String,
                                required: true,
                                validate: [isUrl, 'Not a valid URL']
                            }
                        },
                        token: {
                            access: {
                                type: String,
                                required: true,
                                unique: true
                            },
                            refresh: {
                                type: String,
                                required: true,
                                unique: true
                            },
                            expiresAt: {
                                type: Date,
                                required: true
                            }
                        },
                        service: {
                            name: {
                                type: String,
                                required: true,
                                enum: ['gmail']
                            }
                        }
                    }
                ]
            },
            default: {
                mail: []
            }
        },
        password: {
            type: String,
            required: function () {
                const doc: any = this
                return doc.info.register.method !== 'invitation'
            },
            validate: [isStrongPassword, 'Invalid Password']
        }
    },
    {
        timestamps: true
    }
)

UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    return await compare(password, this.password)
}

UserSchema.methods.hasSystemRight = function (config: {
    rightPath: string
    mustEqualTo: string | number | boolean
    rights?: any
}): boolean | string | Array<unknown> {
    return hasSystemRight({
        rightPath: config.rightPath,
        mustEqualTo: config.mustEqualTo,
        rights: config.rights ?? this.rights.system
    })
}

export default UserSchema
