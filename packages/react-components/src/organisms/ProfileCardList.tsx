import { ReactNode } from 'react';
import { css } from '@emotion/react';

import { Link } from '../atoms';
import {
  rem,
  tabletScreen,
  vminLinearCalc,
  mobileScreen,
  largeDesktopScreen,
} from '../pixels';
import { editIcon } from '../icons';

const styles = (numEntries: number) =>
  css({
    // compensate for cards having more bottom than top padding (see below)
    paddingTop: rem(24),
    paddingBottom: rem(12),

    display: 'grid',
    gridTemplate: `
    repeat(${numEntries}, [edit] minmax(${rem(12)}, auto) [card] auto)
  / [card edit] auto
  `,

    [`@media (min-width: ${tabletScreen.width}px)`]: {
      gridTemplate: `
      repeat(${numEntries}, [card edit] auto)
    / [none] ${rem(36)} [card] auto [edit] ${rem(36)}
    `,
      gridColumnGap: vminLinearCalc(
        mobileScreen,
        24,
        largeDesktopScreen,
        30,
        'px',
      ),
    },
  });
const cardStyles = css({
  ':empty': {
    display: 'none',
  },
  // bottom only to separate from the pencil belonging to the next card
  paddingBottom: rem(24),
  [`@media (min-width: ${tabletScreen.width}px)`]: {
    // top to align with pencil on the side
    paddingTop: rem(12),
  },
});
const editButtonStyles = css({
  justifySelf: 'end',
});

type CardData = {
  card: ReactNode;
  editLink?: {
    href: string;
    label: string;
    enabled?: boolean;
  };
};
interface ProfileCardListProps {
  children: ReadonlyArray<CardData | boolean | null | undefined>;
}
const ProfileCardList: React.FC<ProfileCardListProps> = ({ children }) => (
  <div css={styles(children.length)}>
    {children
      .filter(
        (child): child is CardData => !!child && typeof child === 'object',
      )
      .flatMap(({ card, editLink }, index) => [
        <div
          key={`card-${index}`}
          css={[cardStyles, { gridArea: `${index + 1} card / card` }]}
        >
          {card}
        </div>,
        editLink?.href !== undefined && (
          <div
            key={`edit-${index}`}
            css={[editButtonStyles, { gridArea: `${index + 1} edit / edit` }]}
          >
            <Link
              buttonStyle
              small
              primary
              href={editLink.href}
              label={editLink.label}
              enabled={editLink.enabled}
            >
              {editIcon}
            </Link>
          </div>
        ),
      ])}
  </div>
);

export default ProfileCardList;
