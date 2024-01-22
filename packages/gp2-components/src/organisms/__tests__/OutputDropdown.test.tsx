import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { gp2 as gp2Model } from '@asap-hub/model';

import { OutputDropdownWrapper } from '../OutputDropdown';
import { useCurrentUserRoleGP2 } from '@asap-hub/react-context';

jest.mock('@asap-hub/react-context', () => ({
  useCurrentUserRoleGP2: jest.fn(),
}));

describe('OutputDropdown', () => {
  const mockUseCurrentUserRoleGP2 =
    useCurrentUserRoleGP2 as jest.MockedFunction<typeof useCurrentUserRoleGP2>;

  const user = gp2Fixtures.createAuthUser();
  const renderWithContent = ({
    groups = [],
    projects = [],
    role = 'Trainee',
  }: {
    groups?: gp2Model.UserWorkingGroup[];
    projects?: gp2Model.UserProject[];
    role?: gp2Model.UserRole;
  }) => {
    return render(
      <OutputDropdownWrapper
        user={{ ...user, workingGroups: groups, projects, role }}
      />,
    );
  };

  describe('permissions', () => {
    it('displays working groups and projects if the user is an Admin', () => {
      const { getByText } = renderWithContent({
        groups: [
          {
            title: 'Test Group',
            id: '1',
            members: [],
          },
        ],
        projects: [
          {
            title: 'Test Project',
            id: '1',
            status: 'Active',
            members: [],
          },
        ],
        role: 'Administrator',
      });

      userEvent.click(getByText('Share an output'));
      expect(getByText('Test Group')).toBeInTheDocument();
      expect(getByText('Test Project')).toBeInTheDocument();
    });

    it('displays projects if the user is a PM for the project', () => {
      mockUseCurrentUserRoleGP2.mockReturnValueOnce('Project manager');
      const { getByText, queryByText } = renderWithContent({
        projects: [
          {
            title: 'Test Project 1',
            id: '1',
            status: 'Active',
            members: [
              {
                userId: user.id,
                role: 'Project manager',
              },
            ],
          },
          {
            title: 'Test Project 2',
            id: '2',
            status: 'Active',
            members: [
              {
                userId: user.id,
                role: 'Contributor',
              },
            ],
          },
        ],
      });

      userEvent.click(getByText('Share an output'));
      expect(getByText('Test Project 1')).toBeInTheDocument();
      expect(queryByText('Test Project 2')).not.toBeInTheDocument();
    });

    it('does not display working groups if the user is not an Admin', () => {
      mockUseCurrentUserRoleGP2.mockReturnValueOnce('Project manager');
      const { getByText, queryByText } = renderWithContent({
        projects: [
          {
            title: 'Test Project 1',
            id: '1',
            status: 'Active',
            members: [
              {
                userId: user.id,
                role: 'Project manager',
              },
            ],
          },
        ],
        groups: [
          {
            title: 'Test Group',
            id: '1',
            members: [],
          },
        ],
      });

      userEvent.click(getByText('Share an output'));
      expect(queryByText('Test Group')).not.toBeInTheDocument();
    });

    it('does not display the button if no association available', () => {
      const { queryByText } = renderWithContent({ role: 'Administrator' });

      expect(queryByText('Share an output')).not.toBeInTheDocument();
    });
  });

  describe('document type options', () => {
    it('link to create output page', () => {
      const { getByText, getByTitle } = renderWithContent({
        groups: [
          {
            title: 'Working Group 1',
            id: '1',
            members: [],
          },
          {
            title: 'Working Group 2',
            id: '2',
            members: [],
          },
        ],
        projects: [
          {
            title: 'Project 1',
            id: '1',
            status: 'Active',
            members: [],
          },
          {
            title: 'Project 2',
            id: '2',
            status: 'Active',
            members: [],
          },
        ],
        role: 'Administrator',
      });

      userEvent.click(getByText('Working Group 1'));
      expect(getByTitle('Article')).toBeInTheDocument();
      expect(getByTitle('Article').closest('a')).toHaveAttribute(
        'href',
        '/working-groups/1/create-output/article',
      );

      userEvent.click(getByText('Working Group 1'));

      userEvent.click(getByText('Project 1'));
      expect(getByTitle('Article')).toBeInTheDocument();
      expect(getByTitle('Article').closest('a')).toHaveAttribute(
        'href',
        '/projects/1/create-output/article',
      );
    });
  });
});
