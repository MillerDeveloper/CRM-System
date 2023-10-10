import {
    CURRENCY_FIELD,
    DISCOUNT_FIELD,
    PRICE_FIELD,
    PURCHASING_PRICE_FIELD,
    QUANTITY_FIELD,
    TITLE_FIELD,
    TOTAL_PRICE_FIELD,
    WEIGHT_FIELD
} from './../../../../../shared/constants/element.constants'
import {
    AGE_FIELD,
    CATEGORIES_FIELD,
    CREATEDAT_FIELD,
    DESCRIPTION_FIELD,
    EMAIL_FIELD,
    NAME_FIELD,
    PHONE_FIELD,
    RESPONSIBLES_FIELD
} from '@globalShared/constants/element.constants'

export const LEADS_TEMPLATE = {
    label: {
        text: 'Leads',
        icon: '😀',
        iconType: 'emoji'
    },
    description: '',
    classification: {
        elementsType: 'lively',
        collectionType: 'leads'
    },
    settings: {
        connection: {
            isVisible: true
        }
    },
    viewOptions: [
        {
            viewType: 'table',
            fields: [
                NAME_FIELD,
                DESCRIPTION_FIELD,
                PHONE_FIELD,
                RESPONSIBLES_FIELD,
                CATEGORIES_FIELD,
                CREATEDAT_FIELD,
                AGE_FIELD,
                EMAIL_FIELD
            ]
        }
    ]
}

export const SALES_TEMPLATE = {
    label: {
        text: 'Sales',
        icon: '😍',
        iconType: 'emoji'
    },
    description: '',
    classification: {
        elementsType: 'lively',
        collectionType: 'sales'
    },
    settings: {
        connection: {
            isVisible: true
        }
    },
    viewOptions: [
        {
            viewType: 'table',
            fields: [
                CREATEDAT_FIELD,
                NAME_FIELD,
                DESCRIPTION_FIELD,
                PHONE_FIELD,
                RESPONSIBLES_FIELD,
                CATEGORIES_FIELD,
                AGE_FIELD,
                EMAIL_FIELD
            ]
        }
    ]
}

export const PRODUCTS_TEMPLATE = {
    label: {
        text: 'Products',
        icon: '😍',
        iconType: 'emoji'
    },
    description: '',
    classification: {
        elementsType: 'inanimate',
        collectionType: 'contacts'
    },
    settings: {
        connection: {
            isVisible: true
        }
    },
    viewOptions: [
        {
            viewType: 'table',
            fields: [
                TITLE_FIELD,
                RESPONSIBLES_FIELD,
                CATEGORIES_FIELD,
                WEIGHT_FIELD,
                QUANTITY_FIELD,
                PURCHASING_PRICE_FIELD,
                PRICE_FIELD,
                DISCOUNT_FIELD,
                TOTAL_PRICE_FIELD,
                CURRENCY_FIELD
            ]
        }
    ]
}

export const CONTACTS_TEMPLATE = {
    label: {
        text: 'Contacts',
        icon: '😍',
        iconType: 'emoji'
    },
    description: '',
    classification: {
        elementsType: 'lively',
        collectionType: 'products'
    },
    settings: {
        connection: {
            isVisible: true
        }
    },
    viewOptions: [
        {
            viewType: 'table',
            fields: [
                NAME_FIELD,
                PHONE_FIELD,
                RESPONSIBLES_FIELD,
                CATEGORIES_FIELD,
                CREATEDAT_FIELD,
                AGE_FIELD,
                EMAIL_FIELD
            ]
        }
    ]
}

export const COMPANIES_TEMPLATE = {
    label: {
        text: 'Companies',
        icon: '😍',
        iconType: 'emoji'
    },
    description: '',
    classification: {
        elementsType: 'inanimate',
        collectionType: 'companies'
    },
    settings: {
        connection: {
            isVisible: true
        }
    },
    viewOptions: [
        {
            viewType: 'table',
            fields: [
                TITLE_FIELD,
                DESCRIPTION_FIELD,
                RESPONSIBLES_FIELD,
                CATEGORIES_FIELD,
                CREATEDAT_FIELD
            ]
        }
    ]
}

export const PARTNERS_TEMPLATE = {
    label: {
        text: 'Partners',
        icon: '😍',
        iconType: 'emoji'
    },
    description: '',
    classification: {
        elementsType: 'lively',
        collectionType: 'partners'
    },
    settings: {
        connection: {
            isVisible: true
        }
    },
    viewOptions: [
        {
            viewType: 'table',
            fields: [
                TITLE_FIELD,
                DESCRIPTION_FIELD,
                RESPONSIBLES_FIELD,
                CATEGORIES_FIELD,
                CREATEDAT_FIELD
            ]
        }
    ]
}
