'use client'

import { useEffect, useState } from "react";

export default function useIsMobile(breakpoint = 768) {
    const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined)

    useEffect(() => {
        const mql = window.matchMedia(`(max-width): ${breakpoint - 1}px`);
        const onchange = () => setIsMobile(window.innerWidth < breakpoint);

        mql.addEventListener('change', onchange);
        setIsMobile(window.innerWidth < breakpoint);
        return () => mql.removeEventListener('change', onchange);
    }, [])

    return !!isMobile;
}

