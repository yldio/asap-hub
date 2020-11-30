import React from 'react';
import css from '@emotion/css';
import format from 'date-fns/format';
import { ResearchOutputResponse, ResearchOutputType } from '@asap-hub/model';

import { Card, Link, Headline2, Caption, TagLabel } from '../atoms';
import { perRem } from '../pixels';
import { lead } from '../colors';
import { teamIcon, externalLinkIcon } from '../icons';

const containerStyles = css({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
});

const headerStyles = css({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const textStyles = css({
  flexBasis: '100%',
});

const teamMemberStyles = css({
  color: lead.rgb,
  display: 'flex',
  alignItems: 'center',
  paddingTop: `${12 / perRem}em`,
  paddingBottom: `${12 / perRem}em`,
});

const iconStyles = css({
  display: 'inline-block',
  width: `${24 / perRem}em`,
  height: `${24 / perRem}em`,
  paddingRight: `${15 / perRem}em`,
});

const typeStyles = css({
  display: 'flex',
  alignItems: 'center',
  textTransform: 'capitalize',
});

type SharedResearchCardProps = Pick<
  ResearchOutputResponse,
  'created' | 'publishDate' | 'team' | 'title' | 'type' | 'link'
> & {
  href: string;
  team?: {
    href: string;
  };
};

const labels: Record<ResearchOutputType, string> = {
  Proposal: 'Open External Link',
  Presentation: 'View on Google',
  Dataset: 'Open External Link',
  Code: 'Open External Link',
  Protocol: 'View on Protocols.io',
  'Lab Resource': 'Open External Link',
  Preprint: 'Open External Link',
  Article: 'Open External Link',
};

const SharedResearchCard: React.FC<SharedResearchCardProps> = ({
  created,
  href,
  link,
  publishDate,
  team,
  title,
  type,
}) => {
  const titleComponent = link ? (
    <Headline2 styleAsHeading={4}>{title}</Headline2>
  ) : (
    <Link theme={null} href={href}>
      <Headline2 styleAsHeading={4}>{title}</Headline2>
    </Link>
  );

  return (
    <Card>
      <div css={containerStyles}>
        <div css={headerStyles}>
          <div css={typeStyles}>
            <TagLabel>{type}</TagLabel>
          </div>
          {link ? (
            <div css={{ fontSize: `${13 / perRem}em` }}>
              <Link buttonStyle small={true} href={link}>
                {externalLinkIcon}
                <span css={{ fontWeight: 'normal' }}>
                  {labels[type] || 'Open External Link'}
                </span>
              </Link>
            </div>
          ) : null}
        </div>
        <div css={textStyles}>
          {titleComponent}
          {team && (
            <span css={teamMemberStyles}>
              <span css={iconStyles}>{teamIcon}</span>
              <Link href={team.href}>Team {team.displayName}</Link>
            </span>
          )}
        </div>
        <Caption accent={'lead'} asParagraph>
          Originally Published:
          {format(new Date(publishDate || created), ' do MMMM yyyy')}
        </Caption>
      </div>
    </Card>
  );
};

export default SharedResearchCard;
