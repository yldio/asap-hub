import React from 'react';
import { UserResponse } from '@asap-hub/model';
import css from '@emotion/css';

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
import { perRem } from '../pixels';

const socialContainerStyles = css({
  display: 'grid',
  columnGap: `${12 / perRem}em`,
  gridAutoFlow: 'column',
  alignItems: 'center',
  lineHeight: 0,
  paddingTop: `${15 / perRem}em`,
  paddingBottom: `${17 / perRem}em`,
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
      <Link href={new URL(`https://orcid.org/${orcid}`).toString()}>
        {orcidSocialIcon}
      </Link>
    )}
    {researcherId && (
      <Link
        href={new URL(
          `https://publons.com/researcher/${researcherId}`,
        ).toString()}
      >
        {researcherIdIcon}
      </Link>
    )}
    {twitter && (
      <Link href={new URL(`https://twitter.com/${twitter}`).toString()}>
        {twitterIcon}
      </Link>
    )}
    {github && (
      <Link href={new URL(`https://github.com/${github}`).toString()}>
        {githubIcon}
      </Link>
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
      <Link
        href={new URL(
          `https://www.researchgate.net/profile/${researchGate}`,
        ).toString()}
      >
        {researchGateIcon}
      </Link>
    )}
    {linkedIn && (
      <Link
        href={new URL(`https://www.linkedin.com/in/${linkedIn}`).toString()}
      >
        {linkedInIcon}
      </Link>
    )}
  </div>
);

export default SocialIcons;
