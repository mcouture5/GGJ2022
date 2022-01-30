export const getTruckFontSize = (text: string) => {
    if (!text) return '1rem';
    if (text.length < 30) {
        return '1.4rem';
    }
    if (text.length < 40) {
        return '1rem';
    }
    return '0.65rem';
}
