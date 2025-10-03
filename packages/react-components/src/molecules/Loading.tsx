import { css, keyframes } from '@emotion/react';
import { Paragraph } from '../atoms';
import { rem } from '../pixels';
import { colors } from '..';

const loadingContainerStyles = css({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  minHeight: 400,
  gap: rem(12),
});

const spin = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
});

const spinnerStyles = css({
  width: rem(18),
  height: rem(18),
  border: `${rem(3)} solid ${colors.neutral300.rgb}`,
  borderTop: `${rem(3)} solid ${colors.neutral900.rgb}`,
  borderRadius: '50%',
  animation: `${spin} 1s linear infinite`,
});

const Loading: React.FC<Record<string, never>> = () => (
  <div css={[loadingContainerStyles]}>
    <div css={spinnerStyles} />
    <Paragraph noMargin>Loading...</Paragraph>
  </div>
);

export default Loading;
