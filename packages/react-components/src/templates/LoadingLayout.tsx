import { css } from '@emotion/react';
import { neutral300 } from '../colors';
import { Header } from '../molecules';
import { rem } from '../pixels';
import {
  contentStyles,
  headerStyles,
  menuStyles,
  searchButtonAreaStyles,
  styles,
  userButtonStyles,
} from './Layout';

const menuContainerStyles = css({
  display: 'grid',
  gridColumn: '1 / -1',
  padding: `${rem(21)} ${rem(12)} ${rem(12)} ${rem(12)} `,
});

const userButtonContainerStyles = css({
  display: `grid`,
  gridTemplateColumns: `${rem(88)} ${rem(40)} 1fr`,
  columnGap: rem(16),
  paddingRight: rem(24),
});
const menuRowStyles = css({
  display: 'grid',
  padding: `${rem(16)} ${rem(12)}`,
  columnGap: rem(16),
  gridTemplateColumns: 'min-content 1fr',
});

const iconStyles = css({
  width: rem(24),
  height: rem(24),
  backgroundColor: neutral300.rgb,
  borderRadius: rem(4),
  alignSelf: 'center',
});

const avatarStyles = css({
  width: rem(48),
  height: rem(48),
  backgroundColor: neutral300.rgb,
  borderRadius: '50%',
  alignSelf: 'center',
});

const menuTextStyles = css({
  width: '100%',
  height: rem(18),
  backgroundColor: neutral300.rgb,
  borderRadius: rem(4),
  alignSelf: 'center',
});

const searchIconContainerStyles = css({
  display: 'flex',
  padding: rem(24),
});

export const LoadingUserButton: React.FC<Record<string, never>> = () => (
  <div css={userButtonContainerStyles}>
    <div css={menuTextStyles} />
    <div css={avatarStyles} />
    <div css={[iconStyles, { marginLeft: rem(15) }]} />
  </div>
);

export const LoadingMenu: React.FC<Record<string, never>> = () => (
  <div css={menuContainerStyles}>
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={`menu-row-${i}`} css={menuRowStyles}>
        <div css={iconStyles} />
        <div css={menuTextStyles} />
      </div>
    ))}
  </div>
);

const LoadingLayout: React.FC<Record<string, never>> = () => (
  <article css={styles}>
    <div css={headerStyles}>
      <Header enabled={false} />
    </div>
    <div css={userButtonStyles}>
      <LoadingUserButton />
    </div>
    <div css={searchButtonAreaStyles}>
      <div css={searchIconContainerStyles}>
        <div css={iconStyles} />
      </div>
    </div>
    <main css={contentStyles}></main>
    <div css={menuStyles}>
      <LoadingMenu />
    </div>
  </article>
);

export default LoadingLayout;
