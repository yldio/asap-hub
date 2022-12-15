import { css } from '@emotion/react';
import { WorkingGroupResponse } from '@asap-hub/model';
import { network } from '@asap-hub/routing';

import { Card, Paragraph, Anchor, Caption, Ellipsis, StateTag } from '../atoms';
import { successIcon } from '../icons';
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
  display: 'flex',
  marginBottom: `${16 / perRem}em`,
  flexFlow: 'column',
  gap: `${12 / perRem}em`,

  [`@media (min-width: ${tabletScreen.min}px)`]: {
    flexFlow: 'row',
    gap: `${16 / perRem}em`,
  },
});

const shortTextStyle = css({
  marginBottom: `${24 / perRem}em`,
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    marginBottom: `${36 / perRem}em`,
  },
});

type WorkingGroupCardProps = Pick<
  WorkingGroupResponse,
  | 'id'
  | 'title'
  | 'shortText'
  | 'externalLink'
  | 'lastModifiedDate'
  | 'complete'
>;

const WorkingGroupCard: React.FC<WorkingGroupCardProps> = ({
  id,
  title,
  shortText,
  externalLink,
  lastModifiedDate,
  complete,
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
    </div>
    <div css={linkStyle}>
      {externalLink && (
        <ExternalLink
          href={externalLink}
          label="Working Group Folder"
          full
          noMargin
          size="large"
        />
      )}
      {complete && (
        <div>
          <StateTag accent="green" icon={successIcon} label="Complete" />
        </div>
      )}
    </div>
    <div css={shortTextStyle}>
      <Anchor
        href={
          network({}).workingGroups({}).workingGroup({ workingGroupId: id }).$
        }
      >
        <Ellipsis numberOfLines={2}>
          <Paragraph accent="lead" hasMargin={false}>
            {shortText}
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
