export function debounce<T extends (...args: any[]) => void>(func: T, delay: number): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}

export function throttle<T extends (...args: any[]) => void>(func: T, limit: number):
    (...args: Parameters<T>) => void {
    let inThrottle = false;
    return (...args: Parameters<T>) => {
        if (!inThrottle) {
            inThrottle = true;
            setTimeout(() => {
                inThrottle = false;
                func(...args);
            }, limit);
        }
    };
}