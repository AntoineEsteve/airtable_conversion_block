import { useCallback, useState } from "react";

/**
 * Example:
 * const [checked, toggleChecked, setChecked] = useToggle(false);
 * toggleChecked() // true
 * toggleChecked() // false
 * setChecked(false) // false
 */
export const useToggle = (initialValue: boolean) => {
  const [value, setValue] = useState(initialValue);
  const toggle = useCallback(() => setValue((oldValue) => !oldValue), []);
  return [value, toggle, setValue] as const;
};
