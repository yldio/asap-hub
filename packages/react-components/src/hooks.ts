import {
  useState,
  Dispatch,
  SetStateAction,
  InputHTMLAttributes,
  ChangeEvent,
  useEffect,
  DependencyList,
} from 'react';

export const useInput = <
  V extends InputHTMLAttributes<HTMLInputElement>['value']
>(
  initialValue: V,
): [
  {
    value: V;
    onChange: InputHTMLAttributes<HTMLInputElement>['onChange'];
  },
  V,
  Dispatch<SetStateAction<V>>,
] => {
  const [value, setValue] = useState(initialValue);
  const props = {
    value,
    onChange: ({
      currentTarget: { value: newValue },
    }: ChangeEvent<HTMLInputElement>) => setValue(newValue as V),
  };
  return [props, value, setValue];
};

export const useGifReplay = (
  url: string,
  dependencies: DependencyList,
): string => {
  const [rand, setRand] = useState(Math.random());
  useEffect(() => {
    setRand(Math.random());
  }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps
  return `${url}#${rand}`;
};
