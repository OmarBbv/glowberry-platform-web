'use client'

import { useEffect, useState } from "react";
import * as jose from 'jose'

interface DecodedToken {
    exp: number;
}

export function useTokenValid() {
    const [isValid, setIsValid] = useState<boolean | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setIsValid(false);
            return;
        }

        try {
            const decoded: DecodedToken = jose.decodeJwt(token);
            const now = Date.now() / 1000;

            if (decoded.exp < now) {
                setIsValid(false);
            } else {
                setIsValid(true);
            }
        } catch {
            setIsValid(false);
        }
    }, []);

    return isValid;
}
