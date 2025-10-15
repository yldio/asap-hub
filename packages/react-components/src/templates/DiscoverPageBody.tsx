import { css } from '@emotion/react';
import { DiscoverResponse } from '@asap-hub/model';

import { HelpSection } from '../organisms';
import { rem } from '../pixels';

const styles = css({
  display: 'grid',
  gridRowGap: rem(72),
  paddingBottom: rem(24),
});

const DiscoverPageBody: React.FC<DiscoverResponse> = () => (
  <div css={styles}>
    <HelpSection />
  </div>
);

export default DiscoverPageBody;
