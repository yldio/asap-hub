import { gp2 } from '@asap-hub/model';
import { ExternalLink } from '@asap-hub/react-components';
import { TableDisplay } from '../molecules';

type UserContributingCohortsProps = Pick<
  gp2.UserResponse,
  'contributingCohorts' | 'firstName'
>;
const UserContributingCohorts: React.FC<UserContributingCohortsProps> = ({
  contributingCohorts,
  firstName,
}) => (
  <TableDisplay
    paragraph={`${firstName} has contributed to the following cohort studies:`}
    headings={['Name', 'Role', 'Link']}
    rows={contributingCohorts.map(
      ({ contributingCohortId, name, studyUrl, role }) => {
        const study = studyUrl && (
          <ExternalLink href={studyUrl} label="View study" noMargin />
        );
        return {
          id: contributingCohortId,
          values: [name, role, study],
        };
      },
    )}
  />
);

export default UserContributingCohorts;
