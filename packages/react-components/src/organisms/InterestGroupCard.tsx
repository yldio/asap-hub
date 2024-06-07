import { css } from '@emotion/react';
import { InterestGroupResponse } from '@asap-hub/model';
import { networkRoutes } from '@asap-hub/routing';

import { Paragraph, StateTag } from '../atoms';
import { InactiveBadgeIcon, TeamIcon } from '../icons';
import { rem } from '../pixels';
import EntityCard from './EntityCard';

const iconStyles = css({
  display: 'inline-grid',
  verticalAlign: 'middle',
  paddingRight: rem(8),
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
}) => {
  const href = networkRoutes.DEFAULT.INTEREST_GROUPS.DETAILS.buildPath({
    interestGroupId: id,
  });

  const footer = (
    <Paragraph noMargin>
      <span css={iconStyles}>
        <TeamIcon />
      </span>
      {` ${numberOfTeams} Team${numberOfTeams === 1 ? '' : 's'}`}
    </Paragraph>
  );

  return (
    <EntityCard
      active={active}
      footer={footer}
      googleDrive={googleDrive}
      href={href}
      inactiveBadge={
        <StateTag
          icon={<InactiveBadgeIcon entityName="Interest Group" />}
          label="Inactive"
        />
      }
      tags={tags.map((tag) => tag.name)}
      text={description}
      title={name}
    />
  );
};
export default InterestGroupCard;
