import { useEffect, useRef } from 'react';
import { Point } from '../TransformLayer/pointUtils';

export const useMousePos = (selector: string) => {
  const mousePosition = useRef<Point>({
    x: 0,
    y: 0
  });

  useEffect(() => {
    const stage: HTMLDivElement | null = document.querySelector(selector);

    const onMouseMove = (e: MouseEvent) => {
      mousePosition.current = {
        x: e.clientX,
        y: e.clientY
      };
    };

    if (stage) {
      stage.addEventListener('mousemove', onMouseMove);
    }

    return () => {
      stage?.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return mousePosition;
};
