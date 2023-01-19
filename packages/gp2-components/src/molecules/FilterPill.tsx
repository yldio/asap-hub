import { css } from '@emotion/react';
import {
  borderWidth,
  Button,
  crossSmallIcon,
  Ellipsis,
  pixels,
} from '@asap-hub/react-components';
import colors from '../templates/colors';

const { rem } = pixels;

const styles = css({
  height: rem(40),
  marginRight: rem(9),
  marginTop: rem(5),
  borderStyle: 'solid',
  borderWidth: `${borderWidth}px`,
  borderRadius: rem(24),
  borderColor: colors.neutral500.rgb,
  color: colors.neutral1000.rgb,
});

const containerStyles = css({
  display: 'flex',
  padding: `${rem(9)} ${rem(14)}`,
});

const linksStyles = css({
  border: 'none',
  listStyle: 'none',
  boxShadow: 'none',
  ':hover': {
    boxShadow: 'none',
  },
  margin: 0,
  padding: 0,
  display: 'flex',
});

export interface ValueProps {
  readonly label: string;
  readonly id: string;
}

interface PillProps {
  readonly value: ValueProps;
  onRemove: (value: ValueProps) => void;
}

const FilterPill: React.FC<PillProps> = ({ value, onRemove }) => (
  <span css={[styles]}>
    <Ellipsis>
      <div css={[containerStyles]}>
        <div css={css({ marginRight: rem(8) })}>{value.label}</div>
        <Button
          overrideStyles={css(linksStyles)}
          onClick={() => onRemove(value)}
        >
          {crossSmallIcon}
        </Button>
      </div>
    </Ellipsis>
  </span>
);

export default FilterPill;
