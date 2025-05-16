"use client";
import { useEffect, useState } from "react";

type SetValue<T> = T | ((prevValue: T) => T);

function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: SetValue<T>) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("LocalStorage read error:", error);
      return initialValue;
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const updateLocalStorage = () => {
      try {
        const newValue = storedValue instanceof Function 
          ? storedValue(initialValue)
          : storedValue;
        
        window.localStorage.setItem(key, JSON.stringify(newValue));
      } catch (error) {
        console.error("LocalStorage write error:", error);
      }
    };

    updateLocalStorage();
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

export default useLocalStorage;