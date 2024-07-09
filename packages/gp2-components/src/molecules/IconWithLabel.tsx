import { pixels } from '@asap-hub/react-components';
import { css } from '@emotion/react';

const { rem } = pixels;

type IconWithLabelProps = {
  readonly icon: JSX.Element | React.FC;
  readonly noMargin?: boolean;
};

const styles = css({
  display: 'flex',
  gap: rem(9),
  margin: `${rem(7.5)} 0`,
});

const iconStyles = css({
  display: 'inline-flex',
});

const IconWithLabel: React.FC<React.PropsWithChildren<IconWithLabelProps>> = ({
  icon,
  children,
  noMargin = false,
}) => (
  <div css={[styles, noMargin && { margin: 0 }]}>
    <span css={iconStyles}>{icon}</span>
    {children}
  </div>
);

export default IconWithLabel;
