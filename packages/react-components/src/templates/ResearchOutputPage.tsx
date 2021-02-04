import React from 'react';
import css from '@emotion/css';
import { ResearchOutputResponse } from '@asap-hub/model';
import format from 'date-fns/format';

import {
  TagLabel,
  Display,
  Link,
  Paragraph,
  Card,
  Caption,
  Button,
} from '../atoms';
import { RichText } from '../organisms';
import { lead } from '../colors';
import { perRem } from '../pixels';
import { contentSidePaddingWithNavigation } from '../layout';
import { teamIcon, chevronCircleLeftIcon } from '../icons';

const teamMemberStyles = css({
  color: lead.rgb,
  display: 'flex',
  alignItems: 'center',
  paddingTop: `${12 / perRem}em`,
  paddingBottom: `${24 / perRem}em`,
});

const iconStyles = css({
  display: 'inline-block',
  width: `${24 / perRem}em`,
  height: `${24 / perRem}em`,
  paddingRight: `${15 / perRem}em`,
});

const containerStyles = css({
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)}`,
});

const backContainerStyles = css({
  alignSelf: 'flex-start',
  padding: `${30 / perRem}em 0 `,
});

const backButtonStyles = css({
  display: 'flex',
  alignItems: 'center',
});

const visibilityStyles = css({
  paddingTop: `${24 / perRem}em`,
  paddingBottom: `${30 / perRem}em`,
});

const postedStyles = css({
  color: lead.rgb,
});

type ResearchOutputPageProps = Pick<
  ResearchOutputResponse,
  'created' | 'publishDate' | 'team' | 'text' | 'title' | 'type'
> & {
  team?: {
    href: string;
  };
  goBack: () => void;
};

const ResearchOutputPage: React.FC<ResearchOutputPageProps> = ({
  created,
  publishDate,
  team,
  text,
  title,
  type,
  goBack,
}) => (
  <div css={containerStyles}>
    <div css={backContainerStyles}>
      <Button linkStyle onClick={goBack}>
        <div css={backButtonStyles}>
          <span css={iconStyles}>{chevronCircleLeftIcon}</span> Back
        </div>
      </Button>
    </div>
    <Card>
      <TagLabel>{type}</TagLabel>
      <Display styleAsHeading={3}>{title}</Display>
      {team && (
        <span css={teamMemberStyles}>
          <span css={iconStyles}>{teamIcon} </span>
          <Link href={team.href}>Team {team.displayName}</Link>
        </span>
      )}
      <RichText toc text={text} />
      <div css={visibilityStyles}>
        <Paragraph>
          <strong>Visibility</strong>
          <br />
          Everyone in the ASAP Network
        </Paragraph>
      </div>
      <div css={postedStyles}>
        <Caption asParagraph>
          Posted:
          {format(new Date(publishDate || created), ' Mo MMMM yyyy')}
        </Caption>
      </div>
    </Card>
  </div>
);

export default ResearchOutputPage;
