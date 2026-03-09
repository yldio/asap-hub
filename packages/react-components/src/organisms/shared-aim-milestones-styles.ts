import { css } from '@emotion/react';
import { rem, tabletScreen } from '../pixels';
import { fern, lead, neutral1000 } from '../colors';

export const descriptionContainerStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(4),
  justifyContent: 'flex-start',
});

export const mobileLabelStyles = css({
  fontSize: rem(17),
  fontWeight: 'bold',
  color: neutral1000.rgb,
  display: 'none',
  [`@media (max-width: ${tabletScreen.min - 1}px)`]: {
    display: 'block',
  },
});

export const clampedDescriptionStyles = (isExpanded: boolean) =>
  css({
    color: lead.rgb,
    fontSize: rem(17),
    lineHeight: rem(24),
    margin: 0,
    ...(isExpanded
      ? {}
      : {
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }),
  });

export const readMoreButtonStyles = css({
  background: 'none',
  border: 'none',
  color: fern.rgb,
  cursor: 'pointer',
  padding: 0,
  fontSize: rem(17),
  fontWeight: 400,
  display: 'inline',
  textAlign: 'left',
  '&:hover': {
    textDecoration: 'underline',
  },
});

export const statusContainerStyles = css({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  paddingBlock: rem(4),
  [`@media (max-width: ${tabletScreen.min - 1}px)`]: {
    flexDirection: 'column',
    paddingBlock: 0,
    gap: rem(16),
  },
});

type StatusValue = 'Complete' | 'In Progress' | 'Pending' | 'Terminated';

export const getStatusAccent = (
  status: StatusValue,
): 'success' | 'info' | 'neutral' | 'warning' | 'error' | 'default' => {
  switch (status) {
    case 'Complete':
      return 'success';
    case 'In Progress':
      return 'info';
    case 'Pending':
      return 'neutral';
    case 'Terminated':
      return 'error';
    default:
      return 'default';
  }
};
