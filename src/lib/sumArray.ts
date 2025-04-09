export function sumArray<T>(arr: T[], callback: (item: T) => number): number {
    return arr.reduce((acc, item) => {
        const value = callback(item)
        return acc + (isNaN(value) ? 0 : value)
    }, 0)
}
