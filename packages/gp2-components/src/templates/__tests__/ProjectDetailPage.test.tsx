import { render, screen } from '@testing-library/react';
import { ComponentProps } from 'react';
import ProjectDetailPage from '../ProjectDetailPage';

describe('ProjectDetailPage', () => {
  const defaultProps: ComponentProps<typeof ProjectDetailPage> = {
    title: 'Main Project',
    status: 'Active' as const,
    members: [],
    startDate: '2022-09-22T00:00:00Z',
    endDate: '2022-09-30T00:00:00Z',
    projectProposalUrl: '',
    id: '42',
    isProjectMember: true,
    traineeProject: false,
    isAdministrator: false,
    outputsTotal: 0,
    upcomingTotal: 0,
    pastTotal: 0,
  };
  it('renders header', () => {
    render(<ProjectDetailPage {...defaultProps} />);
    expect(screen.getByRole('banner')).toBeVisible();
  });
  it('renders the body', () => {
    render(<ProjectDetailPage {...defaultProps}>Body</ProjectDetailPage>);
    expect(screen.getByText('Body')).toBeVisible();
  });
});
