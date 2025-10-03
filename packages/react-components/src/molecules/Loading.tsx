import { css } from '@emotion/react';
import Lottie from 'react-lottie';
import { Paragraph } from '../atoms';
import loading from '../lotties/loading.json';
import { rem } from '../pixels';

const loadingContainerStyles = css({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  minHeight: 400,
  gap: rem(12),
});

const lottieWrapStyles = css({ width: rem(24), height: rem(24) });

const Loading: React.FC<Record<string, never>> = () => (
  <div css={[loadingContainerStyles]}>
    <div css={lottieWrapStyles}>
      <Lottie
        options={{
          loop: true,
          autoplay: true,
          animationData: loading,
          rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
          },
        }}
        height={24}
        width={24}
      />
    </div>
    <Paragraph noMargin>Loading...</Paragraph>
  </div>
);

export default Loading;
