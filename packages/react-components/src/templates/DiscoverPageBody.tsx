import { css } from '@emotion/react';
import { DiscoverResponse } from '@asap-hub/model';

import { PagesSection, HelpSection } from '../organisms';
import { perRem } from '../pixels';

const styles = css({
  display: 'grid',
  gridRowGap: `${72 / perRem}em`,
  paddingBottom: `${24 / perRem}em`,
});

const DiscoverPageBody: React.FC<DiscoverResponse> = ({ pages }) => (
  <div css={styles}>
    <PagesSection title={'Grantee Guidance'} pages={pages} />
    <HelpSection />
  </div>
);

export default DiscoverPageBody;
