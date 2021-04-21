import React, { ReactNode, useLayoutEffect, useRef, useState } from 'react';
import usePan from '../hooks/usePan';
import useScale from '../hooks/useScale';
import pointUtils, { ORIGIN } from './pointUtils';
import { useMousePos } from '../hooks/useMousePos';
import { useLast } from '../hooks/useLast';

interface IProps {
  children: ReactNode | ReactNode[];
}

const TransformLayer: React.FC<IProps> = ({ children }: IProps) => {
  const [buffer, setBuffer] = useState(ORIGIN);
  const ref = useRef<HTMLDivElement | null>(null);
  const [offset, startPan] = usePan();
  const scale = useScale(ref);
  
  // Track the mouse position.
  const mousePosRef = useMousePos('.stage');
  
  // Track the last known offset and scale.
  const lastOffset = useLast(offset) || { x: 0, y: 0 };
  const lastScale = useLast(scale) || 1;
  
  // Calculate the delta between the current and last offset—how far the user has panned.
  const delta = pointUtils.diff(offset, lastOffset);
  
  // Since scale also affects offset, we track our own "real" offset that's
  // changed by both panning and zooming.
  const adjustedOffset = useRef(pointUtils.sum(offset, delta));
  
  if (lastScale === scale) {
    // No change in scale—just apply the delta between the last and new offset
    // to the adjusted offset.
    adjustedOffset.current = pointUtils.sum(
      adjustedOffset.current,
      pointUtils.scale(delta, scale)
    );
  } else {
    // The scale has changed—adjust the offset to compensate for the change in
    // relative position of the pointer to the canvas.
    const lastMouse = pointUtils.scale(mousePosRef.current, lastScale);
    const newMouse = pointUtils.scale(mousePosRef.current, scale);
    const mouseOffset = pointUtils.diff(lastMouse, newMouse);
    adjustedOffset.current = pointUtils.sum(adjustedOffset.current, mouseOffset);
  }
  
  useLayoutEffect(() => {
    const height = ref.current?.clientHeight ?? 0;
    const width = ref.current?.clientWidth ?? 0;
    
    setBuffer({
      x: (width - width / scale) / 2,
      y: (height - height / scale) / 2
    });
  }, [scale, setBuffer]);
  
  return (
    <div className="stage" onMouseDown={ startPan } style={ { position: 'relative' } }>
      <div
        style={ {
          backgroundImage: 'url(https://jclem.nyc3.cdn.digitaloceanspaces.com/pan-zoom-canvas-react/grid.svg)',
          transform: `scale(${ scale })`,
          backgroundPosition: `${ -adjustedOffset.current.x }px ${ -adjustedOffset.current.y }px`,
          position: 'absolute',
          bottom: buffer.y,
          left: buffer.x,
          right: buffer.x,
          top: buffer.y
        } }
      />
      <div>
        scale: { scale }
      </div>
    </div>
  );
};

export default TransformLayer;
