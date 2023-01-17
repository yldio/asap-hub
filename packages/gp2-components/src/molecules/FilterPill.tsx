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

interface FilterProps {
  readonly label: string;
  readonly value: string;
}

interface FilterPillProps {
  readonly key: string;
  readonly filter: FilterProps;
  onDelete: () => void;
}

const FilterPill: React.FC<FilterPillProps> = ({ key, filter, onDelete }) => (
  <span css={[styles]}>
    <Ellipsis>
      <div css={[containerStyles]}>
        <div css={css({ marginRight: rem(8) })}>{filter.label}</div>
        <Button overrideStyles={css(linksStyles)} onClick={onDelete}>
          {crossSmallIcon}
        </Button>
      </div>
    </Ellipsis>
  </span>
);

export default FilterPill;
