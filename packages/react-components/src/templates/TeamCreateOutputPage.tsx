import { css } from '@emotion/react';

import { perRem } from '../pixels';
import { steel } from '../colors';
import { contentSidePaddingWithNavigation } from '../layout';

const contentStyles = css({
  borderTop: `1px solid ${steel.rgb}`,
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(10)}`,
});

type TeamCreateOutputPageProps = {};

const TeamCreateOutputPage: React.FC<TeamCreateOutputPageProps> = ({}) => (
  <article>
    <main css={contentStyles}>{}</main>
  </article>
);

export default TeamCreateOutputPage;
