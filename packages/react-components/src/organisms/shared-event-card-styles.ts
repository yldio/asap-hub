import { css } from '@emotion/react';

import { charcoal, steel, tin } from '../colors';
import { mobileScreen, rem, tabletScreen } from '../pixels';

export const contentStyles = css({
  padding: `${rem(32)} ${rem(24)}`,
});

export const contentWithFooterStyles = css({
  paddingBottom: 0,
});

export const headerStyles = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: rem(15),
});

export const actionsStyles = css({
  display: 'flex',
  gap: rem(12),
});

export const iconButtonStyles = css({
  flexGrow: 0,
  width: rem(40),
  height: rem(40),
  alignItems: 'center',
  borderColor: tin.rgb,
  ':hover, :focus': {
    borderColor: tin.rgb,
  },
  [`@media (max-width: ${mobileScreen.max}px)`]: {
    minWidth: rem(40),
  },
});

export const editIconButtonStyles = css([
  iconButtonStyles,
  {
    '> svg': {
      width: rem(24),
      height: rem(24),
      padding: 0,
    },
  },
]);

export const metricsStyles = css({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: rem(24),
  marginTop: rem(24),
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    gridTemplateColumns: '1fr 1fr',
  },
});

export const viewMoreStyles = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: rem(56),
  borderTop: `1px solid ${steel.rgb}`,
});

export const emptyStateStyles = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: rem(24),
});

export const statusIconStyles = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: rem(24),
  height: rem(24),
  verticalAlign: 'middle',
});

export const teamInfoStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: rem(8),
  minWidth: 0,
});

export const tableWrapperStyles = css({
  marginTop: rem(40),
  overflowX: 'auto',
});

export const headerCellStyles = css({
  textAlign: 'left',
  color: charcoal.rgb,
  fontSize: rem(17),
  fontWeight: 'bold',
  lineHeight: rem(24),
  letterSpacing: rem(0.1),
});

export const cellStyles = css({
  padding: `${rem(16)} 0`,
  verticalAlign: 'middle',
});

export const statusCellStyles = css([cellStyles, { lineHeight: 0 }]);
