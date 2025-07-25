import { useState, useEffect } from 'react';

export const useScrollWidth = () => {
  const [scrollWidth, setScrollWidth] = useState(0);

  useEffect(() => {
    const calculateScrollWidth = () => {
      const width = window.innerWidth - document.documentElement.clientWidth;
      setScrollWidth(width);
    };

    calculateScrollWidth();

    window.addEventListener('resize', calculateScrollWidth);

    return () => {
      window.removeEventListener('resize', calculateScrollWidth);
    };
  }, []);

  return scrollWidth;
};