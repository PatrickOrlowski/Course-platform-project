const COUNTRY_HEADER_KEY = 'x-user-country'

export function setUserCountryHeader(header:Headers, country: string | undefined) {
    if (!country) {
        header.delete(COUNTRY_HEADER_KEY)
    } else {
        header.set(COUNTRY_HEADER_KEY, country)
    }
}