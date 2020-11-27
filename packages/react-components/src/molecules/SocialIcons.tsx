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
});

const iconStyles = css({
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
        <div css={iconStyles}>{orcidSocialIcon}</div>
      </Link>
    )}
    {researcherId && (
      <Link
        href={new URL(
          `https://publons.com/researcher/${researcherId}`,
        ).toString()}
      >
        <div css={iconStyles}>{researcherIdIcon}</div>
      </Link>
    )}
    {twitter && (
      <Link href={new URL(`https://twitter.com/${twitter}`).toString()}>
        <div css={iconStyles}>{twitterIcon}</div>
      </Link>
    )}
    {github && (
      <Link href={new URL(`https://github.com/${github}`).toString()}>
        <div css={iconStyles}>{githubIcon}</div>
      </Link>
    )}
    {googleScholar && (
      <Link
        href={`https://scholar.google.co.uk/citations?${new URLSearchParams({
          user: googleScholar,
        }).toString()}`}
      >
        <div css={iconStyles}> {googleScholarIcon}</div>
      </Link>
    )}
    {researchGate && (
      <Link
        href={new URL(
          `https://www.researchgate.net/profile/${researchGate}`,
        ).toString()}
      >
        <div css={iconStyles}>{researchGateIcon}</div>
      </Link>
    )}
    {linkedIn && (
      <Link
        href={new URL(`https://www.linkedin.com/in/${linkedIn}`).toString()}
      >
        <div css={iconStyles}> {linkedInIcon}</div>
      </Link>
    )}
  </div>
);

export default SocialIcons;
