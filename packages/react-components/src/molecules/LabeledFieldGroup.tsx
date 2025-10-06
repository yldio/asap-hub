import { css } from '@emotion/react';
import { ReactNode } from 'react';
import { rem } from '../pixels';

export type LabeledFieldGroupProps = {
  children: ReactNode;
};

const childrenWrapStyles = css({
  marginTop: rem(32),
  display: 'flex',
  flexFlow: 'column',
  gap: rem(48),
});

const LabeledFieldGroup: React.FC<LabeledFieldGroupProps> = ({ children }) => (
  <div css={[childrenWrapStyles]}>{children}</div>
);

export default LabeledFieldGroup;
