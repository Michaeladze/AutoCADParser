import {
  RefObject, useEffect, useState
} from 'react';
import {
  MAX_SCALE, MIN_SCALE, ScaleOpts
} from '../TransformLayer/pointUtils';

/**
 * Listen for `wheel` events on the given element ref and update the reported
 * scale state, accordingly.
 */
export default function useScale(ref: RefObject<HTMLElement | null>) {
  const [scale, setScale] = useState(1);

  const updateScale = ({ direction, interval }: ScaleOpts) => {
    setScale(currentScale => {
      let scale: number;

      // Adjust up to or down to the maximum or minimum scale levels by `interval`.
      if (direction === 'up' && currentScale + interval < MAX_SCALE) {
        scale = currentScale + interval;
      } else if (direction === 'up') {
        scale = MAX_SCALE;
      } else if (direction === 'down' && currentScale - interval > MIN_SCALE) {
        scale = currentScale - interval;
      } else if (direction === 'down') {
        scale = MIN_SCALE;
      } else {
        scale = currentScale;
      }

      return scale;
    });
  };

  const onWheel = (e: WheelEvent) => {
    e.preventDefault();

    updateScale({
      direction: e.deltaY > 0 ? 'up' : 'down',
      interval: 0.025
    });
  };

  useEffect(() => {
    // Set up an event listener such that on `wheel`, we call `updateScale`.
    const stage: HTMLDivElement | null = document.querySelector('.stage');

    if (stage) {
      stage.addEventListener('wheel', onWheel);
    }

    return () => {
      stage?.removeEventListener('wheel', onWheel);
    };
  }, []);

  return scale;
}
