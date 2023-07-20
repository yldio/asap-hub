import { gp2 } from '@asap-hub/model';
import {
  ExternalLink,
  UserProfilePlaceholderCard,
} from '@asap-hub/react-components';
import { ComponentProps } from 'react';
import { EditableCard } from '../molecules';
import CardTable from './CardTable';

type UserContributingCohortsProps = Pick<
  gp2.UserResponse,
  'contributingCohorts' | 'firstName'
> &
  Pick<ComponentProps<typeof EditableCard>, 'editHref'>;
const UserContributingCohorts: React.FC<UserContributingCohortsProps> = ({
  contributingCohorts,
  firstName,
  editHref,
}) => (
  <EditableCard
    editHref={editHref}
    title="Contributing Cohort Studies"
    edit={!!contributingCohorts.length}
    optional
  >
    {editHref && !contributingCohorts.length ? (
      <UserProfilePlaceholderCard>
        List out the contributing cohort studies that you’ve participated in (up
        to ten).
      </UserProfilePlaceholderCard>
    ) : (
      <CardTable headings={['Name', 'Role', 'Link']}>
        {contributingCohorts.map(
          ({ contributingCohortId, name, studyUrl, role }) => {
            const study = studyUrl && (
              <ExternalLink href={studyUrl} label="View study" />
            );
            return {
              id: contributingCohortId,
              values: [name, role, study],
            };
          },
        )}
      </CardTable>
    )}
  </EditableCard>
);

export default UserContributingCohorts;
