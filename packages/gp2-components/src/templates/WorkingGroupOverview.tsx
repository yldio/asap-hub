import { WorkingGroupResponse } from '@asap-hub/model/src/gp2';
import { TeamMembersSection } from '@asap-hub/react-components';

type WorkingGroupOverviewProps = Pick<WorkingGroupResponse, 'members'>;

const WorkingGroupOverview: React.FC<WorkingGroupOverviewProps> = ({
  members,
}) => (
  <div>
    {members.length ? (
      <section>
        <TeamMembersSection
          title={`Working Group Members (${members.length})`}
          members={members.map(
            ({ role, firstName, lastName, avatarUrl, userId: id }) => ({
              firstLine: `${firstName} ${lastName}`,
              secondLine: role,
              avatarUrl,
              firstName,
              lastName,
              id,
            }),
          )}
        />
      </section>
    ) : null}
  </div>
);

export default WorkingGroupOverview;
