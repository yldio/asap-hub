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

// ProjectMembers (List) Stories
export const ResourceNotTeamBased = () => (
  <ProjectMembers members={mockMembers} />
);

export const SingleMember = () => (
  <ProjectMembers members={[mockMembers[0] as ProjectMember]} />
);

export const TwoMembers = () => (
  <ProjectMembers members={mockMembers.slice(0, 2) as ProjectMember[]} />
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
  <ProjectMemberCard member={mockGroupedMember} />
);

export const MemberCardWithoutRole = () => (
  <ProjectMemberCard member={{ ...mockGroupedMember, roles: [] }} />
);

export const MemberCardWithLongRole = () => (
  <ProjectMemberCard
    member={{
      ...mockGroupedMember,
      roles: ['Senior Research Scientist and Laboratory Director'],
    }}
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
  />
);

export const RealWorldExample = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
    <div>
      <h3>Trainee Project Members</h3>
      <ProjectMembers
        members={[
          {
            id: '2',
            displayName: 'Alex Chen',
            firstName: 'Alex',
            lastName: 'Chen',
            role: 'Independent Project - Lead',
            href: '/users/alex-chen',
          },
          {
            id: '3',
            displayName: 'Maria Garcia',
            firstName: 'Maria',
            lastName: 'Garcia',
            role: 'Independent Project - Lead',
            href: '/users/maria-garcia',
          },
          {
            id: '1',
            displayName: 'Dr. Sarah Martinez',
            firstName: 'Sarah',
            lastName: 'Martinez',
            role: 'Independent Project - Mentor',
            href: '/users/sarah-martinez',
          },
        ]}
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
      />
    </div>
  </div>
);
