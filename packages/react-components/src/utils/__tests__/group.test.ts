import { TeamMember } from '@asap-hub/model';
import {
  groupUserTeamsByTeamId,
  groupTeamMembersByUserId,
  groupProjectMembersByUserId,
} from '../group';

describe('groupUserTeamsByTeamId', () => {
  it('returns empty array for empty input', () => {
    expect(groupUserTeamsByTeamId([])).toEqual([]);
  });

  it('returns single entry unchanged for one team with one role', () => {
    const teams = [
      {
        id: 't1',
        displayName: 'Team A',
        role: 'Lead PI (Core Leadership)' as const,
      },
    ];
    const result = groupUserTeamsByTeamId(teams);
    expect(result).toEqual([
      {
        id: 't1',
        displayName: 'Team A',
        roles: ['Lead PI (Core Leadership)'],
        teamInactiveSince: undefined,
        proposal: undefined,
        inactiveSinceDate: undefined,
      },
    ]);
  });

  it('groups multiple roles for the same team', () => {
    const teams = [
      {
        id: 't1',
        displayName: 'Team A',
        role: 'Lead PI (Core Leadership)' as const,
      },
      { id: 't1', displayName: 'Team A', role: 'Project Manager' as const },
    ];
    const result = groupUserTeamsByTeamId(teams);
    expect(result).toHaveLength(1);
    expect(result[0]!.roles).toEqual([
      'Lead PI (Core Leadership)',
      'Project Manager',
    ]);
  });

  it('keeps different teams separate', () => {
    const teams = [
      {
        id: 't1',
        displayName: 'Team A',
        role: 'Lead PI (Core Leadership)' as const,
      },
      { id: 't2', displayName: 'Team B', role: 'Collaborating PI' as const },
    ];
    const result = groupUserTeamsByTeamId(teams);
    expect(result).toHaveLength(2);
    expect(result[0]!.roles).toEqual(['Lead PI (Core Leadership)']);
    expect(result[1]!.roles).toEqual(['Collaborating PI']);
  });

  it('deduplicates identical roles for the same team', () => {
    const teams = [
      {
        id: 't1',
        displayName: 'Team A',
        role: 'Lead PI (Core Leadership)' as const,
      },
      {
        id: 't1',
        displayName: 'Team A',
        role: 'Lead PI (Core Leadership)' as const,
      },
    ];
    const result = groupUserTeamsByTeamId(teams);
    expect(result).toHaveLength(1);
    expect(result[0]!.roles).toEqual(['Lead PI (Core Leadership)']);
  });

  it('clears inactiveSinceDate if any role is still active', () => {
    const teams = [
      {
        id: 't1',
        displayName: 'Team A',
        role: 'Lead PI (Core Leadership)' as const,
        inactiveSinceDate: '2024-01-01',
      },
      {
        id: 't1',
        displayName: 'Team A',
        role: 'Project Manager' as const,
      },
    ];
    const result = groupUserTeamsByTeamId(teams);
    expect(result[0]!.inactiveSinceDate).toBeUndefined();
  });

  it('keeps latest inactiveSinceDate when all roles are inactive', () => {
    const teams = [
      {
        id: 't1',
        displayName: 'Team A',
        role: 'Lead PI (Core Leadership)' as const,
        inactiveSinceDate: '2024-01-01',
      },
      {
        id: 't1',
        displayName: 'Team A',
        role: 'Project Manager' as const,
        inactiveSinceDate: '2024-06-01',
      },
    ];
    const result = groupUserTeamsByTeamId(teams);
    expect(result[0]!.inactiveSinceDate).toBe('2024-06-01');
  });

  it('keeps existing inactiveSinceDate when it is later than new entry', () => {
    const teams = [
      {
        id: 't1',
        displayName: 'Team A',
        role: 'Lead PI (Core Leadership)' as const,
        inactiveSinceDate: '2024-06-01',
      },
      {
        id: 't1',
        displayName: 'Team A',
        role: 'Project Manager' as const,
        inactiveSinceDate: '2024-01-01',
      },
    ];
    const result = groupUserTeamsByTeamId(teams);
    expect(result[0]!.inactiveSinceDate).toBe('2024-06-01');
  });

  it('keeps inactiveSinceDate when new entry has date but existing does not', () => {
    const teams = [
      {
        id: 't1',
        displayName: 'Team A',
        role: 'Lead PI (Core Leadership)' as const,
      },
      {
        id: 't1',
        displayName: 'Team A',
        role: 'Project Manager' as const,
        inactiveSinceDate: '2024-01-01',
      },
    ];
    const result = groupUserTeamsByTeamId(teams);
    expect(result[0]!.inactiveSinceDate).toBeUndefined();
  });
});

const baseMember: TeamMember = {
  id: 'u1',
  firstName: 'John',
  lastName: 'Doe',
  displayName: 'John Doe',
  email: 'john@example.com',
  role: 'Lead PI (Core Leadership)',
};

describe('groupTeamMembersByUserId', () => {
  it('returns empty array for empty input', () => {
    expect(groupTeamMembersByUserId([])).toEqual([]);
  });

  it('groups duplicate members by id, collecting roles', () => {
    const members: TeamMember[] = [
      { ...baseMember, role: 'Lead PI (Core Leadership)' },
      { ...baseMember, role: 'Project Manager' },
    ];
    const result = groupTeamMembersByUserId(members);
    expect(result).toHaveLength(1);
    expect(result[0]!.roles).toEqual([
      'Lead PI (Core Leadership)',
      'Project Manager',
    ]);
  });

  it('keeps different users separate', () => {
    const members: TeamMember[] = [
      { ...baseMember, id: 'u1', role: 'Lead PI (Core Leadership)' },
      {
        ...baseMember,
        id: 'u2',
        displayName: 'Jane',
        role: 'Collaborating PI',
      },
    ];
    const result = groupTeamMembersByUserId(members);
    expect(result).toHaveLength(2);
  });

  it('deduplicates identical roles', () => {
    const members: TeamMember[] = [
      { ...baseMember, role: 'Lead PI (Core Leadership)' },
      { ...baseMember, role: 'Lead PI (Core Leadership)' },
    ];
    const result = groupTeamMembersByUserId(members);
    expect(result[0]!.roles).toEqual(['Lead PI (Core Leadership)']);
  });

  it('merges labs from duplicate entries', () => {
    const members: TeamMember[] = [
      { ...baseMember, labs: [{ id: 'l1', name: 'Lab A' }] },
      { ...baseMember, labs: [{ id: 'l2', name: 'Lab B' }] },
    ];
    const result = groupTeamMembersByUserId(members);
    expect(result[0]!.labs).toEqual([
      { id: 'l1', name: 'Lab A' },
      { id: 'l2', name: 'Lab B' },
    ]);
  });

  it('clears inactiveSinceDate if any entry is still active', () => {
    const members: TeamMember[] = [
      { ...baseMember, inactiveSinceDate: '2024-01-01' },
      { ...baseMember, role: 'Project Manager' },
    ];
    const result = groupTeamMembersByUserId(members);
    expect(result[0]!.inactiveSinceDate).toBeUndefined();
  });

  it('keeps latest inactiveSinceDate when all entries are inactive', () => {
    const members: TeamMember[] = [
      {
        ...baseMember,
        role: 'Lead PI (Core Leadership)',
        inactiveSinceDate: '2024-06-01',
      },
      {
        ...baseMember,
        role: 'Project Manager',
        inactiveSinceDate: '2024-01-01',
      },
    ];
    const result = groupTeamMembersByUserId(members);
    expect(result[0]!.inactiveSinceDate).toBe('2024-06-01');
  });

  it('deduplicates labs with the same id', () => {
    const members: TeamMember[] = [
      { ...baseMember, labs: [{ id: 'l1', name: 'Lab A' }] },
      { ...baseMember, labs: [{ id: 'l1', name: 'Lab A' }] },
    ];
    const result = groupTeamMembersByUserId(members);
    expect(result[0]!.labs).toEqual([{ id: 'l1', name: 'Lab A' }]);
  });

  it('handles members without labs', () => {
    const members: TeamMember[] = [
      { ...baseMember },
      { ...baseMember, role: 'Project Manager' },
    ];
    const result = groupTeamMembersByUserId(members);
    expect(result[0]!.labs).toBeUndefined();
  });

  it('clears alumniSinceDate if any entry has no alumni date', () => {
    const members: TeamMember[] = [
      { ...baseMember, alumniSinceDate: '2024-01-01' },
      { ...baseMember, role: 'Project Manager' },
    ];
    const result = groupTeamMembersByUserId(members);
    expect(result[0]!.alumniSinceDate).toBeUndefined();
  });

  it('does not add labs when new entry has no new labs', () => {
    const members: TeamMember[] = [
      { ...baseMember, labs: [{ id: 'l1', name: 'Lab A' }] },
      { ...baseMember, role: 'Project Manager', labs: [] },
    ];
    const result = groupTeamMembersByUserId(members);
    expect(result[0]!.labs).toEqual([{ id: 'l1', name: 'Lab A' }]);
  });

  it('keeps existing inactiveSinceDate when it is later than new entry', () => {
    const members: TeamMember[] = [
      {
        ...baseMember,
        role: 'Lead PI (Core Leadership)',
        inactiveSinceDate: '2024-06-01',
      },
      {
        ...baseMember,
        role: 'Project Manager',
        inactiveSinceDate: '2024-01-01',
      },
    ];
    const result = groupTeamMembersByUserId(members);
    expect(result[0]!.inactiveSinceDate).toBe('2024-06-01');
  });

  it('updates inactiveSinceDate when new entry has a later date', () => {
    const members: TeamMember[] = [
      {
        ...baseMember,
        role: 'Lead PI (Core Leadership)',
        inactiveSinceDate: '2024-01-01',
      },
      {
        ...baseMember,
        role: 'Project Manager',
        inactiveSinceDate: '2024-06-01',
      },
    ];
    const result = groupTeamMembersByUserId(members);
    expect(result[0]!.inactiveSinceDate).toBe('2024-06-01');
  });

  it('keeps inactiveSinceDate undefined when new entry has date but existing does not', () => {
    const members: TeamMember[] = [
      { ...baseMember },
      {
        ...baseMember,
        role: 'Project Manager',
        inactiveSinceDate: '2024-01-01',
      },
    ];
    const result = groupTeamMembersByUserId(members);
    expect(result[0]!.inactiveSinceDate).toBeUndefined();
  });

  it('merges labs when existing has no labs but new entry does', () => {
    const members: TeamMember[] = [
      { ...baseMember },
      {
        ...baseMember,
        role: 'Project Manager',
        labs: [{ id: 'l1', name: 'Lab A' }],
      },
    ];
    const result = groupTeamMembersByUserId(members);
    expect(result[0]!.labs).toEqual([{ id: 'l1', name: 'Lab A' }]);
  });

  it('preserves alumniSinceDate when all entries have it', () => {
    const members: TeamMember[] = [
      { ...baseMember, alumniSinceDate: '2024-01-01' },
      {
        ...baseMember,
        role: 'Project Manager',
        alumniSinceDate: '2024-06-01',
      },
    ];
    const result = groupTeamMembersByUserId(members);
    expect(result[0]!.alumniSinceDate).toBe('2024-01-01');
  });
});

describe('groupProjectMembersByUserId', () => {
  it('returns empty array for empty input', () => {
    expect(groupProjectMembersByUserId([])).toEqual([]);
  });

  it('groups duplicate project members by id, collecting roles', () => {
    const members = [
      { id: 'u1', displayName: 'John', role: 'Lead' },
      { id: 'u1', displayName: 'John', role: 'Mentor' },
    ];
    const result = groupProjectMembersByUserId(members);
    expect(result).toHaveLength(1);
    expect(result[0]!.roles).toEqual(['Lead', 'Mentor']);
  });

  it('merges teams from duplicate entries', () => {
    const members = [
      {
        id: 'u1',
        displayName: 'John',
        role: 'Lead',
        teams: [{ id: 't1', displayName: 'Team A' }],
      },
      {
        id: 'u1',
        displayName: 'John',
        role: 'Mentor',
        teams: [{ id: 't2', displayName: 'Team B' }],
      },
    ];
    const result = groupProjectMembersByUserId(members);
    expect(result[0]!.teams).toEqual([
      { id: 't1', displayName: 'Team A' },
      { id: 't2', displayName: 'Team B' },
    ]);
  });

  it('deduplicates teams with the same id', () => {
    const members = [
      {
        id: 'u1',
        displayName: 'John',
        role: 'Lead',
        teams: [{ id: 't1', displayName: 'Team A' }],
      },
      {
        id: 'u1',
        displayName: 'John',
        role: 'Mentor',
        teams: [{ id: 't1', displayName: 'Team A' }],
      },
    ];
    const result = groupProjectMembersByUserId(members);
    expect(result[0]!.teams).toEqual([{ id: 't1', displayName: 'Team A' }]);
  });

  it('handles members without roles', () => {
    const members = [
      { id: 'u1', displayName: 'John' },
      { id: 'u1', displayName: 'John', role: 'Lead' },
    ];
    const result = groupProjectMembersByUserId(members);
    expect(result[0]!.roles).toEqual(['Lead']);
  });

  it('handles members without teams', () => {
    const members = [
      { id: 'u1', displayName: 'John', role: 'Lead' },
      { id: 'u1', displayName: 'John', role: 'Mentor' },
    ];
    const result = groupProjectMembersByUserId(members);
    expect(result[0]!.teams).toBeUndefined();
  });

  it('does not add teams when new entry has no new teams', () => {
    const members = [
      {
        id: 'u1',
        displayName: 'John',
        role: 'Lead',
        teams: [{ id: 't1', displayName: 'Team A' }],
      },
      {
        id: 'u1',
        displayName: 'John',
        role: 'Mentor',
        teams: [],
      },
    ];
    const result = groupProjectMembersByUserId(members);
    expect(result[0]!.teams).toEqual([{ id: 't1', displayName: 'Team A' }]);
  });

  it('deduplicates identical roles for the same member', () => {
    const members = [
      { id: 'u1', displayName: 'John', role: 'Lead' },
      { id: 'u1', displayName: 'John', role: 'Lead' },
    ];
    const result = groupProjectMembersByUserId(members);
    expect(result[0]!.roles).toEqual(['Lead']);
  });

  it('merges teams when existing has no teams but new entry does', () => {
    const members = [
      { id: 'u1', displayName: 'John', role: 'Lead' },
      {
        id: 'u1',
        displayName: 'John',
        role: 'Mentor',
        teams: [{ id: 't1', displayName: 'Team A' }],
      },
    ];
    const result = groupProjectMembersByUserId(members);
    expect(result[0]!.teams).toEqual([{ id: 't1', displayName: 'Team A' }]);
  });
});
