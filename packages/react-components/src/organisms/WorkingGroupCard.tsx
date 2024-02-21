import { css } from '@emotion/react';
import { WorkingGroupResponse } from '@asap-hub/model';
import { network } from '@asap-hub/routing';

import {
  Card,
  Paragraph,
  Anchor,
  Caption,
  Ellipsis,
  StateTag,
  Link,
} from '../atoms';
import { googleDriveIcon, successIcon } from '../icons';
import { LinkHeadline, TagList } from '../molecules';
import { perRem, mobileScreen } from '../pixels';
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
  marginBottom: `${16 / perRem}em`,
  gap: `${12 / perRem}em`,
  flexFlow: 'column',
  [`@media (min-width: ${mobileScreen.max}px)`]: {
    flexFlow: 'row',
    gap: `${16 / perRem}em`,
    marginBottom: `${12 / perRem}em`,
  },
});

const shortTextStyle = css({
  marginTop: `${16 / perRem}em`,
  marginBottom: `${24 / perRem}em`,
});

const tagsContainer = css({
  marginBottom: `${12 / perRem}em`,
});

type WorkingGroupCardProps = Pick<
  WorkingGroupResponse,
  | 'id'
  | 'title'
  | 'shortText'
  | 'externalLink'
  | 'lastModifiedDate'
  | 'complete'
  | 'tags'
>;

const WorkingGroupCard: React.FC<WorkingGroupCardProps> = ({
  id,
  title,
  shortText,
  externalLink,
  lastModifiedDate,
  complete,
  tags,
}) => (
  <Card
    overrideStyles={wrapperStyle}
    accent={complete ? 'neutral200' : 'default'}
  >
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
      {complete && (
        <div>
          <StateTag accent="green" icon={successIcon} label="Complete" />
        </div>
      )}
    </div>
    <div>
      {externalLink && (
        <Link href={externalLink} buttonStyle small noMargin>
          {googleDriveIcon} Access Drive
        </Link>
      )}
    </div>
    <div css={shortTextStyle}>
      <Anchor
        href={
          network({}).workingGroups({}).workingGroup({ workingGroupId: id }).$
        }
      >
        <Ellipsis numberOfLines={2}>
          <Paragraph accent="lead" noMargin>
            {shortText}
          </Paragraph>
        </Ellipsis>
      </Anchor>
    </div>
    {!!tags.length && (
      <div css={tagsContainer}>
        <TagList max={3} tags={tags} />
      </div>
    )}
    <Caption noMargin>{`Last updated: ${formatDate(
      new Date(lastModifiedDate),
    )}`}</Caption>
  </Card>
);
export default WorkingGroupCard;
