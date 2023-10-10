import {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URLS
} from '@/shared/constants/integration.constants'
import { google } from 'googleapis'

export function getGoogleAuthClient() {
    return new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URLS)
}

export function getUtmParams(query: string | any) {
    return {
        utm_source: query.utm_source,
        utm_medium: query.utm_medium,
        utm_campaign: query.utm_campaign,
        utm_term: query.utm_term,
        utm_content: query.utm_content
    }
}
