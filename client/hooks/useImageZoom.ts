'use client';

import { useState } from 'react';

export const useImageZoom = () => {
  const [isZoomed, setIsZoomed] = useState(false);

  const handleMouseEnter = () => setIsZoomed(true);
  const handleMouseLeave = () => setIsZoomed(false);

  return {
    isZoomed,
    handlers: {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
    },
  };
};
