declare module 'react-titled' {
  import { ReactNode, FC } from 'react';

  export interface TitledProps {
    title: (parentTitle: string) => string;
    children?: ReactNode;
  }

  export const Titled: FC<TitledProps>;
}
