import { useEffect, useRef } from 'react';

export const useLast = (value: any) => {
  const oldRef = useRef<any>();
  const newRef = useRef<any>();

  useEffect(() => {
    oldRef.current = newRef.current;
    newRef.current = value;
  }, [value]);

  return oldRef.current;
};
