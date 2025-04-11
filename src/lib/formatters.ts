export function formatPlural(
    count: number,
    {
        singular,
        plural,
    }: {
        singular: string
        plural: string
    },
    { includeCount = true } = {}
) {
    const word = count === 1 ? singular : plural
    return includeCount ? `${count} ${word}` : word
}

export function formatPrice(
    priceInDollars: number,
    { showZeroAsNumber = true } = {}
) {
    const formatter = new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: Number.isInteger(priceInDollars) ? 0 : 2,
    })

    if (priceInDollars === 0 && !showZeroAsNumber) {
        return 'Free'
    }

    return formatter.format(priceInDollars)
}

export function formatDate(date: Date) {
    const formatter = new Intl.DateTimeFormat(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
    })

    return formatter.format(new Date(date))
}
