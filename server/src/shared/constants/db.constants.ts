export const DEFAULT_COMPANIES_FIELDS = {
    _id: true,
    name: true,
    workspaceName: true,
    settings: true,
    collections: true,
    integrations: true,
    sites: true
}

export const DEFAULT_USER_FIELDS = {
    _id: true,
    avatar: true,
    name: true,
    email: true,
    workspaceName: true,
    rights: true,
    settings: true,
    createdAt: true,
    updatedAt: true,
    departments: true,
    info: true,
    companies: true,
    integrations: true
}

export const CONNECTION_POPULATE = {
    path: 'connections',
    populate: [
        {
            path: 'collectionRef'
        },
        {
            path: 'elements',
            populate: [
                {
                    path: 'data'
                }
            ]
        }
    ]
}

export const CONNECTION_POPULATE_WITH_COMMENTS = {
    path: 'connections',
    populate: [
        {
            path: 'collectionRef'
        },
        {
            path: 'elements',
            populate: [
                {
                    path: 'data'
                },
                {
                    path: 'comments',
                    populate: {
                        path: 'createdBy',
                        select: DEFAULT_USER_FIELDS
                    }
                }
            ]
        }
    ]
}

export const RESPONSIBLES_POPULATE = {
    path: 'responsibles',
    populate: {
        path: 'data',
        select: DEFAULT_USER_FIELDS
    }
}
