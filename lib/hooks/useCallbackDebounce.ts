import { useCallback } from 'react';

export const useCallbackDebounce = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
) => {
  return useCallback(
    (...args: Parameters<T>) => {
      let timeout: NodeJS.Timeout;
      return new Promise<ReturnType<T>>((resolve) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          resolve(callback(...args));
        }, delay);
      });
    },
    [callback, delay]
  );
}; 