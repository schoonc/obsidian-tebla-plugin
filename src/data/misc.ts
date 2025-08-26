export const isIsoDateString = (str: string): boolean => {
    try {
        return (new Date(str)).toISOString() === str
    } catch (e) {
        return false
    }
}