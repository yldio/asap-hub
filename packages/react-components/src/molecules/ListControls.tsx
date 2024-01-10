import { css } from '@emotion/react';
import { dropdownChevronIcon } from '../icons';
import DropdownButton from './DropdownButton';
import { rem, tabletScreen } from '../pixels';

const containerStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: rem(15),
  'span + svg': {
    width: '11px',
  },
  button: {
    padding: `${rem(8)} ${rem(24)}`,
  },

  [`@media (max-width: ${tabletScreen.min}px)`]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginTop: rem(24),
    width: '100%',
  },
});

interface ListControlsProps {
  readonly isListView: boolean;
  readonly listViewHref: string;
  readonly cardViewHref: string;
}
const ListControls: React.FC<ListControlsProps> = ({
  isListView,
  listViewHref,
  cardViewHref,
}) => (
  <span css={containerStyles}>
    <strong>View as:</strong>
    <DropdownButton
      noMargin
      buttonChildren={() => (
        <>
          <span>{isListView ? 'List' : 'Card'}</span>
          {dropdownChevronIcon}
        </>
      )}
    >
      {{
        item: <>List</>,
        href: listViewHref,
      }}
      {{
        item: <>Card</>,
        href: cardViewHref,
      }}
    </DropdownButton>
  </span>
);

export default ListControls;
