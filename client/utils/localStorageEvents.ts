'use client'

export function setLocalStorageWithEvent(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent('local-storage-change', { detail: { key, value } }));
}

export function removeLocalStorageWithEvent(key: string) {
    localStorage.removeItem(key);
    window.dispatchEvent(new CustomEvent('local-storage-change', { detail: { key } }));
}
