import { Paragraph } from '@asap-hub/react-components';
import { ComponentProps } from 'react';
import { ContactSupport } from '../molecules';
import { UserProjects, UserWorkingGroups } from '../organisms';

type OnboardingGroupsProps = ComponentProps<typeof UserProjects> &
  ComponentProps<typeof UserWorkingGroups>;
const OnboardingGroups: React.FC<OnboardingGroupsProps> = ({
  projects,
  workingGroups,
  ...userProps
}) => (
  <>
    <Paragraph noMargin>
      You’ve already been added to the following groups within the GP2 network
      by one of the admins. Please review the information and get in touch if
      there are any issues.
    </Paragraph>
    {projects && (
      <UserProjects
        {...userProps}
        noLinks
        projects={projects}
        subtitle={<ContactSupport />}
      />
    )}
    {workingGroups && (
      <UserWorkingGroups
        {...userProps}
        noLinks
        workingGroups={workingGroups}
        subtitle={<ContactSupport />}
      />
    )}
  </>
);

export default OnboardingGroups;
