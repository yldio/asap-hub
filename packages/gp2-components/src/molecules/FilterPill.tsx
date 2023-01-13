import { css } from '@emotion/react';
import { borderWidth, Ellipsis, pixels } from '@asap-hub/react-components';
import colors from '../templates/colors';

const { rem } = pixels;

const styles = css({
  display: 'inline-block',
  boxSizing: 'border-box',
  textAlign: 'center',
  height: '40px',
  margin: `${rem(12)} 0`,
  padding: `0 ${rem(8)}`,
  borderStyle: 'solid',
  borderWidth: `${borderWidth}px`,
  borderRadius: rem(20),
  borderColor: colors.neutral500.rgb,
  color: colors.neutral1000.rgb,
});

const FilterPill: React.FC = ({ children }) => (
  <span css={[styles]}>
    <Ellipsis>
      <div>{children}</div>
    </Ellipsis>
  </span>
);

export default FilterPill;
