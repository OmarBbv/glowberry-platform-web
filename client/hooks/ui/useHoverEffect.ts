'use client';

import { useState } from "react";

export const useHoverEffect = () => {
    const [isHovered, setIsHovered] = useState(false);

    const onMouseEnter = () => setIsHovered(true);
    const onMouseLeave = () => setIsHovered(false);

    return {
        isHovered,
        handlers: {
            onMouseEnter,
            onMouseLeave,
        },
    }
}