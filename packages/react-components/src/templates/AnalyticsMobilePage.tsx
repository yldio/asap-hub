import { css } from '@emotion/react';

import { Paragraph } from '../atoms';
import { rem } from '../pixels';
import { deskTopIcon } from '../icons';

const containerStyles = css({
  padding: `30vh ${rem(24)} 0`,
  textAlign: 'center',
});

const headlineStyles = css({
  fontSize: '26px',
  margin: '16px 0',
});
const AnalyticsMobilePage: React.FC = () => (
  <header css={containerStyles}>
    <div>{deskTopIcon}</div>
    <h3 css={headlineStyles}>
      Analytics are only available on the desktop version.
    </h3>
    <Paragraph accent="lead">
      To access all analytics features, please use the desktop version. We
      apologize for any inconvenience this may cause.
    </Paragraph>
  </header>
);

export default AnalyticsMobilePage;
