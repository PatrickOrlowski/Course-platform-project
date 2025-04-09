import { headers } from 'next/headers'
import { pppCoupons } from '@/data/pppCoupons'

const COUNTRY_HEADER_KEY = 'x-user-country'

export function setUserCountryHeader(header:Headers, country: string | undefined) {
    if (!country) {
        header.delete(COUNTRY_HEADER_KEY)
    } else {
        header.set(COUNTRY_HEADER_KEY, country)
    }
}

async function getUserCountry() {
    const head = await headers();
    return head.get(COUNTRY_HEADER_KEY)
}

export async function getUserCoupon(){
    const country = await getUserCountry()
    if (!country) {
        return null
    }

    const coupon = pppCoupons.find((coupon) => coupon.countryCodes.includes(country))

    if (!coupon) {
        return null
    }

    return {
        stripeCouponId: coupon.stripeCouponId,
        discountPercentage: coupon.discountPercentage,
    }
}