import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createAuthUser } from '@asap-hub/fixtures';
import { disable } from '@asap-hub/flags';
import { UserTeam, WorkingGroupMembership } from '@asap-hub/model';

import {
  AssociationItem,
  SharedOutputDropdownBase,
} from '../SharedOutputDropdown';

describe('AssociationItem', () => {
  it('can display a Working Group item', () => {
    const group: WorkingGroupMembership = {
      name: 'A Working Group',
      id: '1',
      role: 'Chair',
      active: true,
    };
    const { getByText } = render(<AssociationItem association={group} />);

    expect(getByText('A Working Group')).toBeInTheDocument();
  });

  it('can display a Team item', () => {
    const team: UserTeam = {
      displayName: 'A Team',
      id: '1',
      role: 'Lead PI (Core Leadership)',
    };
    const { getByText } = render(<AssociationItem association={team} />);
    expect(getByText('A Team')).toBeInTheDocument();
  });
});

describe('ShareOutputDropdown', () => {
  const renderWithContent = ({
    groups = [],
    teams = [],
  }: {
    groups?: WorkingGroupMembership[];
    teams?: UserTeam[];
  }) => {
    const user = createAuthUser();

    return render(
      <SharedOutputDropdownBase
        user={{ ...user, workingGroups: groups, teams }}
      />,
    );
  };

  describe('permissions', () => {
    beforeEach(() => {
      disable('DRAFT_RESEARCH_OUTPUT');
    });
    it('only displays working groups the user can share outputs with', () => {
      const { getByText, queryByText } = renderWithContent({
        groups: [
          {
            name: 'Correct group',
            id: '1',
            active: true,
            role: 'Project Manager',
          },
          { name: 'Wrong group', id: '2', active: false, role: 'Member' },
        ],
      });

      userEvent.click(getByText('Share an output'));
      expect(getByText('Correct group')).toBeInTheDocument();
      expect(queryByText('Wrong group')).not.toBeInTheDocument();
    });
    it('only displays teams the user can share outputs with', () => {
      const { getByText, queryByText } = renderWithContent({
        teams: [
          { displayName: 'Correct team', id: '1', role: 'Project Manager' },
          { displayName: 'Wrong team', id: '2', role: 'Collaborating PI' },
        ],
      });

      userEvent.click(getByText('Share an output'));
      expect(getByText('Correct team')).toBeInTheDocument();
      expect(queryByText('Wrong team')).not.toBeInTheDocument();
    });
  });
  describe('list view', () => {
    it('let you select a team', () => {
      const { getByText, getByTitle } = renderWithContent({
        teams: [
          { displayName: 'Team One', id: '1', role: 'Project Manager' },
          { displayName: 'Team Two', id: '2', role: 'Project Manager' },
        ],
      });

      userEvent.click(getByText('Team One'));
      expect(getByTitle('Bioinformatics')).toBeInTheDocument();
    });
    it('let you select a working group', () => {
      const { getByText, getByTitle } = renderWithContent({
        groups: [
          {
            name: 'Group One',
            id: '1',
            active: true,
            role: 'Project Manager',
          },
        ],
      });

      userEvent.click(getByText('Group One'));
      expect(getByTitle('Bioinformatics')).toBeInTheDocument();
    });
  });
  describe('detail view', () => {
    const teams: UserTeam[] = [
      { displayName: 'Team One', id: '1', role: 'Project Manager' },
      { displayName: 'Team Two', id: '2', role: 'Project Manager' },
    ];

    it('let you create an output', () => {
      const { getByText, getByTitle } = renderWithContent({
        teams,
        groups: [
          {
            name: 'Group One',
            id: '1',
            active: true,
            role: 'Project Manager',
          },
        ],
      });

      userEvent.click(getByText('Team One'));
      expect(getByTitle('Bioinformatics')).toBeInTheDocument();
      expect(getByTitle('Bioinformatics').closest('a')).toHaveAttribute(
        'href',
        '/network/teams/1/create-output/bioinformatics',
      );

      userEvent.click(getByText('Team One'));

      userEvent.click(getByText('Group One'));
      expect(getByTitle('Bioinformatics')).toBeInTheDocument();
      expect(getByTitle('Bioinformatics').closest('a')).toHaveAttribute(
        'href',
        '/network/working-groups/1/create-output/bioinformatics',
      );
    });
    it('let you go back to the list view', () => {
      const { getByText, queryByText, getByTitle } = renderWithContent({
        teams,
      });

      userEvent.click(getByText('Team One'));
      expect(getByTitle('Bioinformatics')).toBeInTheDocument();
      expect(queryByText('Team Two')).not.toBeInTheDocument();

      userEvent.click(getByText('Team One'));
      expect(getByText('Team Two')).toBeInTheDocument();
    });
  });
});
