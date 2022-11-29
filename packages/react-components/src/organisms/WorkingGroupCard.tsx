import { css } from '@emotion/react';
import { WorkingGroupResponse } from '@asap-hub/model';
import { network } from '@asap-hub/routing';

import { Card, Paragraph, Anchor, Caption, Ellipsis } from '../atoms';
import { ExternalLink, LinkHeadline } from '../molecules';
import { perRem, tabletScreen } from '../pixels';
import { formatDate } from '../date';

const wrapperStyle = css({
  display: 'flex',
  flexFlow: 'column',
  paddingTop: `${33 / perRem}em`,
  paddingBottom: `${33 / perRem}em`,
  overflow: 'hidden',
});

const titleStyle = css({
  display: 'flex',
  marginBottom: `${12 / perRem}em`,
});

const linkStyle = css({
  marginBottom: `${15 / perRem}em`,
});

const descriptionStyle = css({
  marginBottom: `${24 / perRem}em`,
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    marginBottom: `${36 / perRem}em`,
  },
});

type WorkingGroupCardProps = Pick<
  WorkingGroupResponse,
  | 'id'
  | 'title'
  | 'description'
  | 'externalLink'
  | 'externalLinkText'
  | 'lastModifiedDate'
>;

const WorkingGroupCard: React.FC<WorkingGroupCardProps> = ({
  id,
  title,
  description,
  externalLink,
  externalLinkText,
  lastModifiedDate,
}) => (
  <Card overrideStyles={wrapperStyle}>
    <div css={titleStyle}>
      <LinkHeadline
        href={
          network({}).workingGroups({}).workingGroup({ workingGroupId: id }).$
        }
        level={2}
        styleAsHeading={4}
        noMargin
      >
        {title}
      </LinkHeadline>
    </div>
    <div css={linkStyle}>
      {externalLink && (
        <ExternalLink
          href={externalLink}
          label={externalLinkText}
          full
          noMargin
          size="large"
        />
      )}
    </div>
    <div css={descriptionStyle}>
      <Anchor
        href={
          network({}).workingGroups({}).workingGroup({ workingGroupId: id }).$
        }
      >
        <Ellipsis numberOfLines={2}>
          <Paragraph accent="lead" hasMargin={false}>
            {description}
          </Paragraph>
        </Ellipsis>
      </Anchor>
    </div>
    <Caption noMargin>{`Last updated: ${formatDate(
      new Date(lastModifiedDate),
    )}`}</Caption>
  </Card>
);
export default WorkingGroupCard;
