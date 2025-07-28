import { useEffect, useState } from "react";

type LocalStorageKeys = "data" | "isComplated" | "phoneNumber" | "role" | "token" | "location";

type LocalStorageData = Partial<Record<LocalStorageKeys, string>>;

export const useLocalStorageAll = (): LocalStorageData => {
    const [data, setData] = useState<LocalStorageData>({});

    const updateData = () => {
        const allData: LocalStorageData = {};

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (["data", "isComplated", "phoneNumber", "role", "token", "location"] as string[]).includes(key)) {
                allData[key as LocalStorageKeys] = localStorage.getItem(key) || "";
            }
        }

        setData(allData);
    };

    useEffect(() => {
        updateData();
        const handleStorageChange = (e: StorageEvent) => {
            if (e.storageArea === localStorage) {
                updateData();
            }
        };

        const handleCustomStorageChange = () => {
            updateData();
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('localStorageChange', handleCustomStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('localStorageChange', handleCustomStorageChange);
        };
    }, []);

    return data;
};
