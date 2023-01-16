import { css } from '@emotion/react';
import {
  borderWidth,
  crossSmallIcon,
  Ellipsis,
  pixels,
} from '@asap-hub/react-components';
import colors from '../templates/colors';

const { rem } = pixels;

const styles = css({
  height: rem(40),
  marginRight: rem(9),
  borderStyle: 'solid',
  borderWidth: `${borderWidth}px`,
  borderRadius: rem(24),
  borderColor: colors.neutral500.rgb,
  color: colors.neutral1000.rgb,
});

const containerStyle = css({
  display: 'flex',
  padding: `${rem(9)} ${rem(14)}`,
});

interface FilterPillProps {
  readonly key: string;
  readonly filter: string;
}

const FilterPill: React.FC<FilterPillProps> = ({ key, filter }) => (
  <span key={key} css={[styles]}>
    <Ellipsis>
      <div css={[containerStyle]}>
        <div css={css({ marginRight: rem(8) })}>{filter}</div>
        <span css={css({ fill: colors.neutral900.rgb })}>{crossSmallIcon}</span>
      </div>
    </Ellipsis>
  </span>
);

export default FilterPill;
