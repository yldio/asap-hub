import { useState, Dispatch, SetStateAction, InputHTMLAttributes } from 'react';

export const useInput = <
  V extends InputHTMLAttributes<HTMLInputElement>['value']
>(
  initialValue: V,
): [
  Partial<InputHTMLAttributes<HTMLInputElement>>,
  V,
  Dispatch<SetStateAction<V>>,
] => {
  const [value, setValue] = useState(initialValue);
  const props: Partial<InputHTMLAttributes<HTMLInputElement>> = {
    value,
    onChange: ({ target: { value: newValue } }) => setValue(newValue as V),
  };
  return [props, value, setValue];
};
