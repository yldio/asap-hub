import { css } from '@emotion/react';
import { InterestGroupResponse } from '@asap-hub/model';
import { network } from '@asap-hub/routing';

import { Card, Paragraph, Anchor, StateTag, Link } from '../atoms';
import { LinkHeadline, TagList } from '../molecules';
import { googleDriveIcon, inactiveBadgeIcon, TeamIcon } from '../icons';
import { perRem, tabletScreen } from '../pixels';

const iconStyles = css({
  display: 'inline-grid',
  verticalAlign: 'middle',
  paddingRight: `${15 / perRem}em`,
});

const titleStyle = css({
  display: 'flex',
  flexFlow: 'column',
  alignItems: 'flex-start',
  [`@media (min-width: ${tabletScreen.width}px)`]: {
    flexFlow: 'row',
    gap: `${16 / perRem}em`,
    alignItems: 'center',
    marginBottom: `${-12 / perRem}em`,
  },
});

const descriptionStyles = css({
  marginTop: `${4 / perRem}em`,
  marginBottom: `${24 / perRem}em`,
});

const buttonStyle = css({
  '> a': {
    backgroundColor: 'transparent',
  },
});

type InterestGroupCardProps = Pick<
  InterestGroupResponse,
  'id' | 'name' | 'description' | 'tags' | 'active'
> & {
  readonly numberOfTeams: number;
} & Pick<InterestGroupResponse['tools'], 'googleDrive'>;
const InterestGroupCard: React.FC<InterestGroupCardProps> = ({
  id,
  name,
  description,
  tags,
  numberOfTeams,
  active,
  googleDrive,
}) => (
  <Card accent={active ? 'default' : 'neutral200'}>
    <div css={titleStyle}>
      <LinkHeadline
        href={
          network({}).interestGroups({}).interestGroup({ interestGroupId: id })
            .$
        }
        level={2}
        styleAsHeading={4}
      >
        {name}
      </LinkHeadline>
      {!active && <StateTag icon={inactiveBadgeIcon} label="Inactive" />}
    </div>
    {googleDrive && (
      <span css={buttonStyle}>
        <Link href={googleDrive} buttonStyle small>
          {googleDriveIcon} Access Drive
        </Link>
      </span>
    )}
    <Anchor
      href={
        network({}).interestGroups({}).interestGroup({ interestGroupId: id }).$
      }
    >
      <Paragraph accent="lead" styles={descriptionStyles}>
        {description}
      </Paragraph>
    </Anchor>
    <TagList min={2} max={3} tags={tags} />
    <Paragraph>
      <span css={iconStyles}>
        <TeamIcon />
      </span>
      {` ${numberOfTeams} Team${numberOfTeams === 1 ? '' : 's'}`}
    </Paragraph>
  </Card>
);
export default InterestGroupCard;
