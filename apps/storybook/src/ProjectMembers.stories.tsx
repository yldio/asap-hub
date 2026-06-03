import {
  ProjectMembers,
  ProjectMemberCard,
  GroupedProjectMember,
} from '@asap-hub/react-components';
import { ProjectMember } from '@asap-hub/model';

export default {
  title: 'Molecules / Project Members',
};

const mockMembers: ProjectMember[] = [
  {
    id: '1',
    displayName: 'John Doe',
    firstName: 'John',
    lastName: 'Doe',
    role: 'Principal Investigator',
    href: '/users/john-doe',
    avatarUrl: undefined,
  },
  {
    id: '2',
    displayName: 'Jane Smith',
    firstName: 'Jane',
    lastName: 'Smith',
    role: 'Co-Investigator',
    href: '/users/jane-smith',
    avatarUrl: undefined,
  },
  {
    id: '3',
    displayName: 'Michael Johnson',
    firstName: 'Michael',
    lastName: 'Johnson',
    role: 'Research Associate',
    href: '/users/michael-johnson',
    avatarUrl: undefined,
  },
];

const membersWithSingleTeam: ProjectMember[] = mockMembers.map((m) => ({
  ...m,
  teams: [{ id: 'team-1', displayName: 'Alpha Team' }],
}));

const membersWithMultipleTeams: ProjectMember[] = mockMembers.map((m, idx) => ({
  ...m,
  teams:
    idx === 0
      ? [
          { id: 'team-1', displayName: 'Alpha Team' },
          { id: 'team-2', displayName: 'Genomics Lab' },
          { id: 'team-3', displayName: 'Neuroscience Team' },
          { id: 'team-4', displayName: 'PD Consortium' },
        ]
      : [
          { id: 'team-1', displayName: 'Alpha Team' },
          { id: 'team-5', displayName: 'Another Lab' },
        ],
}));

// ProjectMembers (List) Stories
export const ResourceNotTeamBased = () => (
  <ProjectMembers members={mockMembers} showTeamInfo={false} />
);

export const TraineeWithTeamInfo = () => (
  <ProjectMembers members={membersWithSingleTeam} showTeamInfo={true} />
);

export const TraineeWithTeamInfoAndBadge = () => (
  <ProjectMembers members={membersWithMultipleTeams} showTeamInfo={true} />
);

export const SingleMember = () => (
  <ProjectMembers
    members={[mockMembers[0] as ProjectMember]}
    showTeamInfo={false}
  />
);

export const TwoMembers = () => (
  <ProjectMembers
    members={mockMembers.slice(0, 2) as ProjectMember[]}
    showTeamInfo={false}
  />
);

// ProjectMemberCard (Individual) Stories
const mockGroupedMember: GroupedProjectMember = {
  id: '1',
  displayName: 'John Doe',
  firstName: 'John',
  lastName: 'Doe',
  roles: ['Principal Investigator'],
  href: '/users/john-doe',
};

export const IndividualMemberCard = () => (
  <ProjectMemberCard member={mockGroupedMember} showTeamInfo={false} />
);

export const MemberCardWithTeam = () => (
  <ProjectMemberCard
    member={{
      ...mockGroupedMember,
      teams: [{ id: 'team-1', displayName: 'Alpha Team' }],
    }}
    showTeamInfo={true}
  />
);

export const MemberCardWithTeamAndBadge = () => (
  <ProjectMemberCard
    member={{
      ...mockGroupedMember,
      teams: [
        { id: 'team-1', displayName: 'Anderson Research Team' },
        { id: 'team-2', displayName: 'Team 2' },
        { id: 'team-3', displayName: 'Team 3' },
        { id: 'team-4', displayName: 'Team 4' },
        { id: 'team-5', displayName: 'Team 5' },
        { id: 'team-6', displayName: 'Team 6' },
      ],
    }}
    showTeamInfo={true}
  />
);

export const MemberCardWithoutRole = () => (
  <ProjectMemberCard
    member={{ ...mockGroupedMember, roles: [] }}
    showTeamInfo={false}
  />
);

export const MemberCardWithLongRole = () => (
  <ProjectMemberCard
    member={{
      ...mockGroupedMember,
      roles: ['Senior Research Scientist and Laboratory Director'],
      teams: [
        { id: 'team-1', displayName: 'Neuroscience Research Consortium' },
      ],
    }}
    showTeamInfo={true}
  />
);

export const MembersWithMultipleRoles = () => (
  <ProjectMembers
    members={[
      {
        id: '1',
        displayName: 'John Doe',
        firstName: 'John',
        lastName: 'Doe',
        role: 'Principal Investigator',
        href: '/users/john-doe',
      },
      {
        id: '1',
        displayName: 'John Doe',
        firstName: 'John',
        lastName: 'Doe',
        role: 'Co-Investigator',
        href: '/users/john-doe',
      },
      {
        id: '2',
        displayName: 'Jane Smith',
        firstName: 'Jane',
        lastName: 'Smith',
        role: 'Research Associate',
        href: '/users/jane-smith',
      },
      {
        id: '2',
        displayName: 'Jane Smith',
        firstName: 'Jane',
        lastName: 'Smith',
        role: 'Data Analyst',
        href: '/users/jane-smith',
      },
      {
        id: '2',
        displayName: 'Jane Smith',
        firstName: 'Jane',
        lastName: 'Smith',
        role: 'Lab Manager',
        href: '/users/jane-smith',
      },
      {
        id: '2',
        displayName: 'Jane Smith',
        firstName: 'Jane',
        lastName: 'Smith',
        role: 'Coordinator',
        href: '/users/jane-smith',
      },
      {
        id: '3',
        displayName: 'Michael Johnson',
        firstName: 'Michael',
        lastName: 'Johnson',
        role: 'Contributor',
        href: '/users/michael-johnson',
      },
    ]}
    showTeamInfo={false}
  />
);

export const TraineeWithMultipleRolesAndTeams = () => (
  <ProjectMembers
    members={[
      {
        id: '1',
        displayName: 'Alex Chen',
        firstName: 'Alex',
        lastName: 'Chen',
        role: 'Trainee Project - Lead',
        href: '/users/alex-chen',
        teams: [
          { id: 'team-1', displayName: 'Alpha Team' },
          { id: 'team-2', displayName: 'Genomics Lab' },
        ],
      },
      {
        id: '1',
        displayName: 'Alex Chen',
        firstName: 'Alex',
        lastName: 'Chen',
        role: 'Trainee Project - Mentor',
        href: '/users/alex-chen',
        teams: [{ id: 'team-1', displayName: 'Alpha Team' }],
      },
      {
        id: '2',
        displayName: 'Maria Garcia',
        firstName: 'Maria',
        lastName: 'Garcia',
        role: 'Trainee Project - Key Personnel',
        href: '/users/maria-garcia',
        teams: [{ id: 'team-1', displayName: 'Alpha Team' }],
      },
    ]}
    showTeamInfo={true}
  />
);

export const RealWorldExample = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
    <div>
      <h3>Trainee Project Members (with team info)</h3>
      <ProjectMembers
        members={[
          {
            id: '2',
            displayName: 'Alex Chen',
            firstName: 'Alex',
            lastName: 'Chen',
            role: 'Trainee Project - Lead',
            href: '/users/alex-chen',
            teams: [{ id: 'team-1', displayName: 'Alpha Team' }],
          },
          {
            id: '3',
            displayName: 'Maria Garcia',
            firstName: 'Maria',
            lastName: 'Garcia',
            role: 'Trainee Project - Lead',
            href: '/users/maria-garcia',
            teams: [
              { id: 'team-1', displayName: 'Alpha Team' },
              { id: 'team-4', displayName: 'Genomics Lab' },
            ],
          },
          {
            id: '1',
            displayName: 'Dr. Sarah Martinez',
            firstName: 'Sarah',
            lastName: 'Martinez',
            role: 'Trainee Project - Mentor',
            href: '/users/sarah-martinez',
            teams: [
              { id: 'team-1', displayName: 'Alpha Team' },
              { id: 'team-2', displayName: 'Neuroscience Research' },
              { id: 'team-3', displayName: 'PD Consortium' },
            ],
          },
        ]}
        showTeamInfo={true}
      />
    </div>

    <div>
      <h3>Resource Project Members (not team-based)</h3>
      <ProjectMembers
        members={[
          {
            id: '4',
            displayName: 'Dr. Robert Lee',
            firstName: 'Robert',
            lastName: 'Lee',
            role: 'Lead Developer',
            href: '/users/robert-lee',
          },
          {
            id: '5',
            displayName: 'Emily Watson',
            firstName: 'Emily',
            lastName: 'Watson',
            role: 'Data Scientist',
            href: '/users/emily-watson',
          },
          {
            id: '6',
            displayName: 'David Kim',
            firstName: 'David',
            lastName: 'Kim',
            role: 'Bioinformatics Specialist',
            href: '/users/david-kim',
          },
        ]}
        showTeamInfo={false}
      />
    </div>
  </div>
);
