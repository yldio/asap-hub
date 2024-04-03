import { css } from '@emotion/react';

import { Headline3, Paragraph } from '../atoms';
import { rem } from '../pixels';
import { deskTopIcon } from '../icons';

const containerStyles = css({
  padding: `35% ${rem(24)} 0`,
  textAlign: 'center',
});

const AnalyticsMobilePage: React.FC = () => (
  <header css={containerStyles}>
    <div>{deskTopIcon}</div>
    <Headline3>Analytics are only available on the desktop version.</Headline3>
    <Paragraph accent="lead">
      To access all analytics features, please use the desktop version. We
      apologize for any inconvenience this may cause.
    </Paragraph>
  </header>
);

export default AnalyticsMobilePage;
