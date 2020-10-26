import React from 'react';

import css from '@emotion/css';

import { perRem } from '../pixels';
import { Paragraph, Link } from '../atoms';
import { CtaCard } from '../molecules';
import { createMailTo } from '../utils';

const bottomStyles = css({
  display: 'grid',
  gridRowGap: `${36 / perRem}em`,
});

const LatestNews: React.FC = () => {
  const mailToGrants = createMailTo('grants@parkinsonsroadmap.org', {
    subject: 'ASAP Hub: Grant support',
  });

  const mailToSupport = createMailTo('techsupport@asap.science', {
    subject: 'ASAP Hub: Tech support',
  });

  return (
    <section css={bottomStyles}>
      <CtaCard href={mailToGrants} buttonText="Contact Us">
        <strong>Need help with grant-related matter?</strong>
        <br /> ASAP and the Michael J Fox Foundation are here to help
      </CtaCard>
      <Paragraph>
        If you're facing a technical issue with the Hub, please{' '}
        <Link href={mailToSupport}>get in touch</Link>. Our support team is
        happy to help!
      </Paragraph>
    </section>
  );
};

export default LatestNews;
