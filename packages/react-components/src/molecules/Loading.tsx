import { css } from '@emotion/react';
import Lottie from 'react-lottie';
import { Paragraph } from '../atoms';
import loading from '../lotties/loading.json';

const loadingContainerStyles = css({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  minHeight: '400px',
  gap: '12px',
});

const Loading: React.FC<Record<string, never>> = () => (
  <div css={[loadingContainerStyles]}>
    <div css={css({ width: 24, height: 24 })}>
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
