import { useCallback } from 'react';

export function useImageHoverZoom() {
    const handleMouseMove = useCallback(
        (e: React.MouseEvent<HTMLDivElement, MouseEvent>, imageId: string) => {
            const image = document.getElementById(imageId) as HTMLElement;
            if (!image) return;

            const rect = image.getBoundingClientRect();
            let x = ((e.clientX - rect.left) / rect.width) * 100;
            let y = ((e.clientY - rect.top) / rect.height) * 100;

            x = Math.max(10, Math.min(90, x));
            y = Math.max(10, Math.min(90, y));


            image.style.transformOrigin = `${x}% ${y}%`;
            image.style.transform = 'scale(1.5)';
        },
        []
    );


    const handleMouseLeave = useCallback((imageId: string) => {
        const image = document.getElementById(imageId) as HTMLElement;
        if (!image) return;

        image.style.transformOrigin = 'center';
        image.style.transform = 'scale(1.5)';
    }, []);

    return { handleMouseMove, handleMouseLeave };
}
