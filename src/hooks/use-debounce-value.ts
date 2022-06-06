import debounce from 'lodash/debounce';
import { useEffect, useRef } from 'react';

export function useDebounceValue<T>(value: T, delay: number = 1000) {
  // State and setters for debounced value
  const debouncedValue = useRef(value);

  // prettier-ignore
  useEffect(debounce(() => {
    debouncedValue.current = value
  }, delay), [value]);

  return debouncedValue.current;
}
