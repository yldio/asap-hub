import { css } from '@emotion/react';

import { perRem } from '../pixels';
import { Paragraph, Link } from '../atoms';
import { CtaCard } from '../molecules';
import { mailToGrants, mailToSupport } from '../mail';

const bottomStyles = css({
  display: 'grid',
  gridRowGap: `${36 / perRem}em`,
});

const HelpSection: React.FC = () => (
  <section css={bottomStyles}>
    <CtaCard href={mailToGrants()} buttonText="Request grant help">
      <strong>Need help with grant-related matter?</strong>
      <br /> ASAP and the Michael J Fox Foundation are here to help
    </CtaCard>
    <Paragraph accent="lead">
      If you're facing a technical issue with the Hub, our team is happy to
      help! <Link href={mailToSupport()}>Contact tech support</Link>.
    </Paragraph>
  </section>
);

export default HelpSection;
