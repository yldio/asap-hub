import {
  getByText as getChildByText,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, { ComponentProps, useState } from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { ManuscriptDataObject } from '@asap-hub/model';

import ProjectProfileWorkspace from '../ProjectProfileWorkspace';

const noopUpdateManuscript = jest.fn().mockResolvedValue({});
const noopCreateDiscussion = jest.fn().mockResolvedValue(undefined);
const noopReplyToDiscussion = jest.fn().mockResolvedValue(undefined);
const noopMarkDiscussionAsRead = jest.fn().mockResolvedValue(undefined);
const useManuscriptByIdStub = () =>
  useState<ManuscriptDataObject | undefined>(undefined);

const defaultProps: ComponentProps<typeof ProjectProfileWorkspace> = {
  id: 'project-1',
  isProjectMember: true,
  isTeamBased: true,
  manuscripts: [],
  collaborationManuscripts: [],
  tools: [],
  lastModifiedDate: new Date('2020-07-07T19:33:00Z').toISOString(),
  contactEmail: 'john@example.com',
  contactName: 'John Doe',
  toolsHref: '/workspace/tools',
  editToolHref: (index: number) => `/workspace/tools/${index}`,
  onUpdateManuscript: noopUpdateManuscript,
  isComplianceReviewer: false,
  createDiscussion: noopCreateDiscussion,
  useManuscriptById: useManuscriptByIdStub,
  onReplyToDiscussion: noopReplyToDiscussion,
  onMarkDiscussionAsRead: noopMarkDiscussionAsRead,
  isActiveProject: true,
};

const renderWithRouter = (component: React.ReactElement) => {
  const router = createMemoryRouter([{ path: '/*', element: component }], {
    initialEntries: ['/'],
  });
  return render(<RouterProvider router={router} />);
};

describe('ProjectProfileWorkspace', () => {
  describe('Compliance Review', () => {
    it('renders the Compliance Review heading', () => {
      const { getByRole } = renderWithRouter(
        <ProjectProfileWorkspace {...defaultProps} />,
      );
      expect(
        getByRole('heading', { name: 'Compliance Review' }),
      ).toBeInTheDocument();
    });

    it('renders the compliance description', () => {
      const { getByText } = renderWithRouter(
        <ProjectProfileWorkspace {...defaultProps} />,
      );
      expect(
        getByText(
          'This directory contains all manuscripts with their compliance reports.',
        ),
      ).toBeInTheDocument();
    });

    it('renders Submit Manuscript button for active project members', () => {
      const { getByRole } = renderWithRouter(
        <ProjectProfileWorkspace
          {...defaultProps}
          isProjectMember={true}
          isActiveProject={true}
        />,
      );
      expect(
        getByRole('button', { name: /Submit Manuscript/ }),
      ).toBeInTheDocument();
    });

    it('does not render Submit Manuscript button for non-members', () => {
      const { queryByRole } = renderWithRouter(
        <ProjectProfileWorkspace
          {...defaultProps}
          isProjectMember={false}
          isActiveProject={true}
        />,
      );
      expect(
        queryByRole('button', { name: /Submit Manuscript/ }),
      ).not.toBeInTheDocument();
    });

    it('does not render Submit Manuscript button for inactive projects', () => {
      const { queryByRole } = renderWithRouter(
        <ProjectProfileWorkspace
          {...defaultProps}
          isProjectMember={true}
          isActiveProject={false}
        />,
      );
      expect(
        queryByRole('button', { name: /Submit Manuscript/ }),
      ).not.toBeInTheDocument();
    });

    describe('team-based projects', () => {
      it('renders Team Submission section', () => {
        const { getByText } = renderWithRouter(
          <ProjectProfileWorkspace {...defaultProps} isTeamBased={true} />,
        );
        expect(getByText('Team Submission')).toBeInTheDocument();
      });

      it('renders Collaborator Submission section', () => {
        const { getByText } = renderWithRouter(
          <ProjectProfileWorkspace {...defaultProps} isTeamBased={true} />,
        );
        expect(getByText('Collaborator Submission')).toBeInTheDocument();
      });

      it('renders empty state copy for team submission when user is project member', () => {
        const { getByText } = renderWithRouter(
          <ProjectProfileWorkspace
            {...defaultProps}
            isTeamBased={true}
            isProjectMember={true}
          />,
        );
        expect(
          getByText(
            'Your project has not submitted a manuscript for compliance review.',
          ),
        ).toBeInTheDocument();
      });

      it('renders empty state copy for collaborator submission with "projects" mention when user is project member', () => {
        const { getByText } = renderWithRouter(
          <ProjectProfileWorkspace
            {...defaultProps}
            isTeamBased={true}
            isProjectMember={true}
          />,
        );
        expect(
          getByText(
            'Your project has not been listed as a contributor on manuscripts that were submitted for compliance review by other projects.',
          ),
        ).toBeInTheDocument();
      });

      it('renders staff copy when user is not a project member', () => {
        const { getByText } = renderWithRouter(
          <ProjectProfileWorkspace
            {...defaultProps}
            isTeamBased={true}
            isProjectMember={false}
          />,
        );
        expect(
          getByText(
            'This project has not submitted a manuscript for compliance review.',
          ),
        ).toBeInTheDocument();
        expect(
          getByText(
            'This project has not been listed as a contributor on manuscripts that were submitted for compliance review by other projects.',
          ),
        ).toBeInTheDocument();
      });

      it('renders manuscript submission copy when manuscripts exist', () => {
        const { getByText } = renderWithRouter(
          <ProjectProfileWorkspace
            {...defaultProps}
            isTeamBased={true}
            isProjectMember={true}
            manuscripts={['manuscript-1']}
          />,
        );
        expect(
          getByText(
            'The following manuscripts were submitted by your project for compliance review.',
          ),
        ).toBeInTheDocument();
      });

      it('renders collaboration copy when collaboration manuscripts exist', () => {
        const { getByText } = renderWithRouter(
          <ProjectProfileWorkspace
            {...defaultProps}
            isTeamBased={true}
            isProjectMember={true}
            collaborationManuscripts={['manuscript-2']}
          />,
        );
        expect(
          getByText(
            /submitted by another project for compliance review. Your project has been listed as a contributor/,
          ),
        ).toBeInTheDocument();
      });

      it('renders empty state for collaborator section when collaborationManuscripts is undefined', () => {
        const { getByText } = renderWithRouter(
          <ProjectProfileWorkspace
            {...defaultProps}
            isTeamBased={true}
            isProjectMember={true}
            collaborationManuscripts={undefined}
          />,
        );
        expect(
          getByText(
            'Your project has not been listed as a contributor on manuscripts that were submitted for compliance review by other projects.',
          ),
        ).toBeInTheDocument();
      });
    });

    describe('user-based projects', () => {
      it('does not render Team Submission section', () => {
        const { queryByText } = renderWithRouter(
          <ProjectProfileWorkspace {...defaultProps} isTeamBased={false} />,
        );
        expect(queryByText('Team Submission')).not.toBeInTheDocument();
      });

      it('does not render Collaborator Submission section', () => {
        const { queryByText } = renderWithRouter(
          <ProjectProfileWorkspace {...defaultProps} isTeamBased={false} />,
        );
        expect(queryByText('Collaborator Submission')).not.toBeInTheDocument();
      });
    });
  });

  describe('Collaboration Tools', () => {
    it('renders the Collaboration Tools heading for project members', () => {
      const { getByRole } = renderWithRouter(
        <ProjectProfileWorkspace {...defaultProps} isProjectMember={true} />,
      );
      expect(
        getByRole('heading', {
          name: 'Collaboration Tools (Project Only)',
        }),
      ).toBeInTheDocument();
    });

    it('does not render Collaboration Tools for non-members', () => {
      const { queryByRole } = renderWithRouter(
        <ProjectProfileWorkspace {...defaultProps} isProjectMember={false} />,
      );
      expect(
        queryByRole('heading', {
          name: 'Collaboration Tools (Project Only)',
        }),
      ).not.toBeInTheDocument();
    });

    it('renders the collaboration tools description', () => {
      const { getByText } = renderWithRouter(
        <ProjectProfileWorkspace {...defaultProps} isProjectMember={true} />,
      );
      expect(
        getByText(
          /This directory contains the most important links for your project's internally shared resources/,
        ),
      ).toBeInTheDocument();
    });

    it('renders the Add Collaboration Tools CTA', () => {
      const { getByRole } = renderWithRouter(
        <ProjectProfileWorkspace {...defaultProps} isProjectMember={true} />,
      );
      expect(
        getByRole('link', { name: 'Add Collaboration Tools' }),
      ).toBeInTheDocument();
    });

    it('renders tool cards when tools are provided', () => {
      const { getByText } = renderWithRouter(
        <ProjectProfileWorkspace
          {...defaultProps}
          isProjectMember={true}
          tools={[
            {
              name: 'Signal',
              description: 'Our chat tool',
              url: 'https://signal.group/our',
            },
          ]}
        />,
      );
      expect(getByText('Signal')).toBeInTheDocument();
    });

    it('renders last edited timestamp', () => {
      const { getByText } = renderWithRouter(
        <ProjectProfileWorkspace {...defaultProps} isProjectMember={true} />,
      );
      expect(getByText(/Last edited on/)).toBeInTheDocument();
    });

    it('renders last edited with name when lastModifiedBy is provided', () => {
      const { getByText } = renderWithRouter(
        <ProjectProfileWorkspace
          {...defaultProps}
          isProjectMember={true}
          lastModifiedBy="Ekemini Riley"
        />,
      );
      expect(getByText(/Ekemini Riley/)).toBeInTheDocument();
    });

    it('renders last edited with linked name when lastModifiedByHref is provided', () => {
      const { getByRole } = renderWithRouter(
        <ProjectProfileWorkspace
          {...defaultProps}
          isProjectMember={true}
          lastModifiedBy="Ekemini Riley"
          lastModifiedByHref="/users/ekemini-riley"
        />,
      );
      const link = getByRole('link', { name: 'Ekemini Riley' });
      expect(link).toHaveAttribute('href', '/users/ekemini-riley');
    });
  });

  describe('Project Contact Email', () => {
    it('renders the Project Contact Email heading for project members', () => {
      const { getByRole } = renderWithRouter(
        <ProjectProfileWorkspace
          {...defaultProps}
          isProjectMember={true}
          contactEmail="john@example.com"
          contactName="John Doe"
        />,
      );
      expect(
        getByRole('heading', { name: 'Project Contact Email' }),
      ).toBeInTheDocument();
    });

    it('renders the contact name as a mailto link', () => {
      const { getByRole } = renderWithRouter(
        <ProjectProfileWorkspace
          {...defaultProps}
          isProjectMember={true}
          contactEmail="john@example.com"
          contactName="John Doe"
        />,
      );
      const link = getByRole('link', { name: 'John Doe' });
      expect(link).toHaveAttribute('href', expect.stringContaining('mailto:'));
    });

    it('renders contact ASAP support link', () => {
      const { getByRole } = renderWithRouter(
        <ProjectProfileWorkspace
          {...defaultProps}
          isProjectMember={true}
          contactEmail="john@example.com"
          contactName="John Doe"
        />,
      );
      expect(
        getByRole('link', { name: 'contact ASAP support' }),
      ).toBeInTheDocument();
    });

    it('does not render Project Contact Email for non-members', () => {
      const { queryByRole } = renderWithRouter(
        <ProjectProfileWorkspace
          {...defaultProps}
          isProjectMember={false}
          contactEmail="john@example.com"
          contactName="John Doe"
        />,
      );
      expect(
        queryByRole('heading', { name: 'Project Contact Email' }),
      ).not.toBeInTheDocument();
    });

    it('renders contact email as link text when contactName is missing', () => {
      const { getByRole } = renderWithRouter(
        <ProjectProfileWorkspace
          {...defaultProps}
          isProjectMember={true}
          contactEmail="john@example.com"
          contactName={undefined}
        />,
      );
      const link = getByRole('link', { name: 'john@example.com' });
      expect(link).toHaveAttribute('href', expect.stringContaining('mailto:'));
    });

    it('does not render Project Contact Email when email is missing', () => {
      const { queryByRole } = renderWithRouter(
        <ProjectProfileWorkspace
          {...defaultProps}
          isProjectMember={true}
          contactEmail={undefined}
          contactName={undefined}
        />,
      );
      expect(
        queryByRole('heading', { name: 'Project Contact Email' }),
      ).not.toBeInTheDocument();
    });
  });

  describe('Eligibility Modal', () => {
    it('renders eligibility modal when user clicks on Submit Manuscript', async () => {
      const mockSetEligibilityReasons = jest.fn();
      const { container, getByRole } = renderWithRouter(
        <ProjectProfileWorkspace
          {...defaultProps}
          isProjectMember={true}
          isActiveProject={true}
          setEligibilityReasons={mockSetEligibilityReasons}
          createManuscriptHref="/workspace/create-manuscript"
        />,
      );

      expect(container).not.toHaveTextContent(
        'Do you need to submit a manuscript?',
      );

      await userEvent.click(
        getByRole('button', { name: /Submit Manuscript/i }),
      );

      expect(container).toHaveTextContent(
        'Do you need to submit a manuscript?',
      );
    });

    it('hides the eligibility modal when user clicks on Cancel', async () => {
      const mockSetEligibilityReasons = jest.fn();
      const { container, getByRole } = renderWithRouter(
        <ProjectProfileWorkspace
          {...defaultProps}
          isProjectMember={true}
          isActiveProject={true}
          setEligibilityReasons={mockSetEligibilityReasons}
          createManuscriptHref="/workspace/create-manuscript"
        />,
      );

      await userEvent.click(
        getByRole('button', { name: /Submit Manuscript/i }),
      );

      expect(container).toHaveTextContent(
        'Do you need to submit a manuscript?',
      );

      await userEvent.click(getByRole('button', { name: /cancel/i }));

      expect(container).not.toHaveTextContent(
        'Do you need to submit a manuscript?',
      );
    });

    it('does not navigate when createManuscriptHref is not provided', async () => {
      const mockSetEligibilityReasons = jest.fn();
      const router = createMemoryRouter(
        [
          {
            path: '/*',
            element: (
              <ProjectProfileWorkspace
                {...defaultProps}
                isProjectMember={true}
                isActiveProject={true}
                setEligibilityReasons={mockSetEligibilityReasons}
              />
            ),
          },
        ],
        { initialEntries: ['/'] },
      );
      const { getByRole } = render(<RouterProvider router={router} />);

      await userEvent.click(
        getByRole('button', { name: /Submit Manuscript/i }),
      );

      await userEvent.click(screen.getByText(/Yes/i));
      await userEvent.click(
        screen.getByText(
          'The manuscript resulted from a pivot stemming from the findings of the ASAP-funded proposal.',
        ),
      );
      await userEvent.click(screen.getByText(/Continue/i));

      await waitFor(() => {
        expect(router.state.location.pathname).toBe('/');
      });
    });

    it('navigates to manuscript form when user completes eligibility modal', async () => {
      const mockSetEligibilityReasons = jest.fn();
      const router = createMemoryRouter(
        [
          {
            path: '/*',
            element: (
              <ProjectProfileWorkspace
                {...defaultProps}
                isProjectMember={true}
                isActiveProject={true}
                setEligibilityReasons={mockSetEligibilityReasons}
                createManuscriptHref="/workspace/create-manuscript"
              />
            ),
          },
        ],
        { initialEntries: ['/'] },
      );
      const { getByRole } = render(<RouterProvider router={router} />);

      await userEvent.click(
        getByRole('button', { name: /Submit Manuscript/i }),
      );

      await userEvent.click(screen.getByText(/Yes/i));
      await userEvent.click(
        screen.getByText(
          'The manuscript resulted from a pivot stemming from the findings of the ASAP-funded proposal.',
        ),
      );
      await userEvent.click(screen.getByText(/Continue/i));

      await waitFor(() => {
        expect(router.state.location.pathname).toBe(
          '/workspace/create-manuscript',
        );
      });
    });
  });

  it('defaults isActiveProject to true when not provided', () => {
    const { container } = renderWithRouter(
      <ProjectProfileWorkspace {...defaultProps} isActiveProject={undefined} />,
    );
    expect(container).toHaveTextContent('Compliance Review');
  });

  it('passes isTargetManuscript when targetManuscriptId matches', () => {
    jest.spyOn(console, 'error').mockImplementation();
    renderWithRouter(
      <ProjectProfileWorkspace
        {...defaultProps}
        manuscripts={['manuscript-1']}
        targetManuscriptId="manuscript-1"
      />,
    );
    expect(screen.getByTestId('team-manuscripts')).toBeInTheDocument();
  });

  describe('Tool actions', () => {
    it('calls onDeleteTool with correct index when delete is clicked', async () => {
      jest.spyOn(console, 'error').mockImplementation();
      const handleDeleteTool = jest.fn();
      const { getByText } = renderWithRouter(
        <ProjectProfileWorkspace
          {...defaultProps}
          isProjectMember={true}
          tools={[
            {
              name: 'Signal',
              description: 'Our chat tool',
              url: 'https://signal.group/our',
            },
            {
              name: 'Discord',
              description: 'Our call tool',
              url: 'https://discord.gg/our',
            },
          ]}
          onDeleteTool={handleDeleteTool}
        />,
      );
      const discordCard = getByText('Discord').closest('li')!;

      await userEvent.click(getChildByText(discordCard, /delete/i));

      await waitFor(() => expect(handleDeleteTool).toHaveBeenCalledWith(1));
    });
  });
});
