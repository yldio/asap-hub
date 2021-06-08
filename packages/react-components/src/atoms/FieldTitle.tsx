import { ReactNode } from 'react';

interface FieldTitleProps {
  readonly children: ReactNode;
  readonly required?: boolean;
  readonly ommitRequiredIcon?: boolean;
}

const FieldTitle: React.FC<FieldTitleProps> = ({
  children,
  required = false,
  ommitRequiredIcon = false,
}) => (
  <>
    {children}
    {required && !ommitRequiredIcon && '*'}
  </>
);

export default FieldTitle;
