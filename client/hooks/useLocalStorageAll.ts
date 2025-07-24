import { useEffect, useState } from "react";

type LocalStorageKeys = "data" | "isComplated" | "phoneNumber" | "role" | "token";

type LocalStorageData = Partial<Record<LocalStorageKeys, string>>;

export const useLocalStorageAll = (): LocalStorageData => {
    const [data, setData] = useState<LocalStorageData>({});

    useEffect(() => {
        const allData: LocalStorageData = {};

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (["data", "isComplated", "phoneNumber", "role", "token"] as string[]).includes(key)) {
                allData[key as LocalStorageKeys] = localStorage.getItem(key) || "";
            }
        }

        setData(allData);
    }, []);

    return data;
}
