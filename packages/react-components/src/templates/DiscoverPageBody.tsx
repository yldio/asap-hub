import { css } from '@emotion/react';
import { DiscoverResponse } from '@asap-hub/model';

import { HelpSection } from '../organisms';
import { perRem } from '../pixels';

const styles = css({
  display: 'grid',
  gridRowGap: `${72 / perRem}em`,
  paddingBottom: `${24 / perRem}em`,
});

const DiscoverPageBody: React.FC<DiscoverResponse> = () => (
  <div css={styles}>
    <HelpSection />
  </div>
);

export default DiscoverPageBody;
