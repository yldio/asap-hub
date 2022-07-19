import { pixels } from '@asap-hub/react-components';
import { css } from '@emotion/react';

const { rem } = pixels;

type IconWithLabelProps = {
  readonly icon: JSX.Element;
};
const styles = css({
  display: 'flex',
  gap: rem(9),
  margin: `${rem(8)} 0`,
});
const iconStyles = css({
  display: 'inline-flex',
});

const IconWithLabel: React.FC<IconWithLabelProps> = ({ icon, children }) => (
  <div css={styles}>
    <span css={iconStyles}>{icon}</span>
    {children}
  </div>
);

export default IconWithLabel;
