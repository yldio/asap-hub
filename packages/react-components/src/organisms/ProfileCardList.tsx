import { ReactNode } from 'react';
import { css } from '@emotion/react';

import { Link } from '../atoms';
import {
  perRem,
  tabletScreen,
  vminLinearCalc,
  mobileScreen,
  largeDesktopScreen,
} from '../pixels';
import { editIcon } from '../icons';

const styles = (numEntries: number) =>
  css({
    // compensate for cards having more bottom than top padding (see below)
    paddingTop: `${24 / perRem}em`,
    paddingBottom: `${12 / perRem}em`,

    display: 'grid',
    gridTemplate: `
    repeat(${numEntries}, [edit] minmax(${12 / perRem}em, auto) [card] auto)
  / [card edit] auto
  `,

    [`@media (min-width: ${tabletScreen.width}px)`]: {
      gridTemplate: `
      repeat(${numEntries}, [card edit] auto)
    / [none] ${36 / perRem}em [card] auto [edit] ${36 / perRem}em
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
  // bottom only to separate from the pencil belonging to the next card
  paddingBottom: `${24 / perRem}em`,
  [`@media (min-width: ${tabletScreen.width}px)`]: {
    // top to align with pencil on the side
    paddingTop: `${12 / perRem}em`,
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
