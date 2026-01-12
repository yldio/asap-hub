import { TeamProfileWorkspace } from '@asap-hub/react-components';
import {
  createManuscriptResponse,
  createTeamResponse,
} from '@asap-hub/fixtures';

export default {
  title: 'Templates / Team Profile / Workspace',
  component: TeamProfileWorkspace,
};

export const Normal = () => {
  const teamResponse = createTeamResponse({ teamMembers: 1 });
  return (
    <TeamProfileWorkspace
      {...teamResponse}
      members={[
        {
          id: 'pm-id',
          displayName: 'Andrei Covaciu',
          firstName: 'Andrei',
          lastName: 'Covaciu',
          email: 'pm@example.com',
          role: 'Project Manager',
        },
        ...(teamResponse.members || []),
      ]}
      setEligibilityReasons={() => {}}
      tools={[
        {
          name: 'My Tool',
          url: 'https://example.com/tool',
          description: 'Tool Description',
        },
      ]}
      isTeamMember={true}
      isComplianceReviewer={false}
      onUpdateManuscript={() => Promise.resolve(createManuscriptResponse())}
      createDiscussion={() => Promise.resolve('compliance-discussion-id')}
      useManuscriptById={() => [undefined, () => {}]}
      onReplyToDiscussion={() => Promise.resolve()}
      onMarkDiscussionAsRead={() => Promise.resolve()}
    />
  );
};
