export default function isArrayEmpty(value: string[]): boolean {
    if(!value || (value && value.length === 0)) {
        return true;
    }

    return false;
}