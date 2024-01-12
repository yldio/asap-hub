import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { mockLocation } from '@asap-hub/dom-test-utils';
import ProjectDetailHeader from '../ProjectDetailHeader';

describe('ProjectDetailHeader', () => {
  const defaultProps: ComponentProps<typeof ProjectDetailHeader> = {
    id: '42',
    title: 'Main Project',
    status: 'Active' as const,
    members: [],
    startDate: '2022-09-22T00:00:00Z',
    endDate: '2022-09-30T00:00:00Z',
    projectProposalUrl: 'www.google.pt',
    isProjectMember: true,
    traineeProject: false,
    isAdministrator: false,
    outputsTotal: 0,
    upcomingTotal: 0,
    pastTotal: 0,
    pmEmail: 'john.doe@example.com',
    opportunitiesAvailable: false,
    opportunitiesLink: 'http://example.com',
  };
  const { mockGetLocation } = mockLocation();

  it('renders title, number of members and number of projects', () => {
    render(<ProjectDetailHeader {...defaultProps} />);
    expect(screen.getByRole('heading', { name: 'Main Project' })).toBeVisible();
    expect(screen.getByText('0 Members')).toBeVisible();
    expect(screen.getByText('View proposal')).toBeVisible();
  });

  describe('Opportunities Available Card', () => {
    it('conditionally renders opportunities available card', () => {
      const { rerender } = render(<ProjectDetailHeader {...defaultProps} />);
      expect(
        screen.queryByRole('heading', { name: /opportunities available/i }),
      ).not.toBeInTheDocument();

      rerender(
        <ProjectDetailHeader {...defaultProps} opportunitiesAvailable={true} />,
      );

      expect(
        screen.getByRole('heading', { name: /opportunities available/i }),
      ).toBeVisible();
      expect(screen.getByRole('link', { name: /contact pm/i })).toBeVisible();
    });

    it('displays default texts when opportunities are available but short text and link name are not present', () => {
      render(
        <ProjectDetailHeader {...defaultProps} opportunitiesAvailable={true} />,
      );

      expect(
        screen.getByText(
          /This project is currently looking for additional team members/i,
        ),
      ).toBeVisible();
      expect(screen.getByRole('link', { name: /read more/i })).toBeVisible();
    });

    it('displays opportunities short text and link name when present', () => {
      render(
        <ProjectDetailHeader
          {...defaultProps}
          opportunitiesAvailable={true}
          opportunitiesShortText="There are a few opportunities available"
          opportunitiesLinkName="Get in Touch"
        />,
      );

      expect(
        screen.queryByText(
          /This project is currently looking for additional team members/i,
        ),
      ).not.toBeInTheDocument();
      expect(
        screen.getByText(/There are a few opportunities available/i),
      ).toBeVisible();
      expect(
        screen.queryByRole('link', { name: /read more/i }),
      ).not.toBeInTheDocument();
      expect(screen.getByRole('link', { name: /get in touch/i })).toBeVisible();
    });

    it('conditionally renders external link icon if link is an external link', () => {
      const opportunitiesLink = new URL(
        '/example',
        mockGetLocation(),
      ).toString();
      const { rerender } = render(
        <ProjectDetailHeader
          {...defaultProps}
          opportunitiesAvailable={true}
          opportunitiesLink={opportunitiesLink}
        />,
      );

      expect(
        screen.queryByRole('link', { name: /read more external link/i }),
      ).not.toBeInTheDocument();

      rerender(
        <ProjectDetailHeader
          {...defaultProps}
          opportunitiesAvailable={true}
          opportunitiesLink={'http://example.com'}
        />,
      );
      expect(
        screen.getByRole('link', { name: /read more external link/i }),
      ).toBeVisible();
    });

    it('copy button adds email to clipboard', async () => {
      Object.assign(navigator, {
        clipboard: {
          writeText: jest.fn(),
        },
      });
      jest.spyOn(navigator.clipboard, 'writeText');
      render(
        <ProjectDetailHeader
          {...defaultProps}
          opportunitiesAvailable={true}
          pmEmail={'test@example.com'}
        />,
      );
      const copyButton = screen.getByRole('button', { name: 'Copy' });
      expect(copyButton).toBeVisible();
      userEvent.click(copyButton);
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        'test@example.com',
      );
    });
  });

  it('renders overview tab', () => {
    render(<ProjectDetailHeader {...defaultProps} />);
    expect(screen.getByRole('link', { name: 'Overview' })).toBeVisible();
  });
  it('renders Workspace tab if you are a member', () => {
    render(<ProjectDetailHeader {...defaultProps} isProjectMember={true} />);
    expect(screen.getByRole('link', { name: 'Workspace' })).toBeVisible();
  });
  it('does not render Workspace tab if you are not a member', () => {
    render(<ProjectDetailHeader {...defaultProps} isProjectMember={false} />);
    expect(
      screen.queryByRole('link', { name: 'Workspace' }),
    ).not.toBeInTheDocument();
  });
  it('renders share output if you are an admin', () => {
    render(<ProjectDetailHeader {...defaultProps} isAdministrator={true} />);
    expect(
      screen.getByRole('button', { name: /share an output/i }),
    ).toBeVisible();
  });
  it('renders outputs tab with the count', () => {
    render(<ProjectDetailHeader {...defaultProps} outputsTotal={42} />);
    expect(
      screen.getByRole('link', { name: /shared outputs \(42\)/i }),
    ).toBeVisible();
  });
  it('renders upcoming events tab with the count', () => {
    render(<ProjectDetailHeader {...defaultProps} upcomingTotal={42} />);
    expect(
      screen.getByRole('link', { name: /upcoming events \(42\)/i }),
    ).toBeVisible();
  });
  it('renders past events tab with the count', () => {
    render(<ProjectDetailHeader {...defaultProps} pastTotal={42} />);
    expect(
      screen.getByRole('link', { name: /past events \(42\)/i }),
    ).toBeVisible();
  });
});
