import React from 'react';
import { UserResponse } from '@asap-hub/model';
import css from '@emotion/css';
import { join } from 'path';

import { Link } from '../atoms';
import {
  linkedInIcon,
  githubIcon,
  twitterIcon,
  researchGateIcon,
  researcherIdIcon,
  orcidSocialIcon,
  googleScholarIcon,
} from '../icons';

const socialContainerStyles = css({
  display: 'grid',
  columnGap: '12px',
  gridAutoFlow: 'column',
  alignItems: 'center',
  lineHeight: 0,
});

type SocialIconsProps = UserResponse['social'];

const SocialIcons: React.FC<SocialIconsProps> = ({
  github,
  linkedIn,
  orcid,
  researcherId,
  twitter,
  googleScholar,
  researchGate,
}) => (
  <div css={socialContainerStyles}>
    {orcid && (
      <Link href={join('https://orcid.org', orcid)}>{orcidSocialIcon}</Link>
    )}
    {researcherId && (
      <Link href={join('https://publons.com/researcher', researcherId)}>
        {researcherIdIcon}
      </Link>
    )}
    {twitter && (
      <Link href={join('https://twitter.com', twitter)}>{twitterIcon}</Link>
    )}
    {github && (
      <Link href={join('https://github.com', github)}>{githubIcon}</Link>
    )}
    {googleScholar && (
      <Link
        href={`https://scholar.google.co.uk/citations?${new URLSearchParams({
          user: googleScholar,
        }).toString()}`}
      >
        {googleScholarIcon}
      </Link>
    )}
    {researchGate && (
      <Link href={join('https://www.researchgate.net/profile', researchGate)}>
        {researchGateIcon}
      </Link>
    )}
    {linkedIn && (
      <Link href={join('https://www.linkedin.com/in/', linkedIn)}>
        {linkedInIcon}
      </Link>
    )}
  </div>
);

export default SocialIcons;
