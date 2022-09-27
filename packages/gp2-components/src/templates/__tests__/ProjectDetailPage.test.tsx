import { render, screen } from '@testing-library/react';
import ProjectDetailPage from '../ProjectDetailPage';

describe('ProjectDetailPage', () => {
  const defaultProps = {
    backHref: '/back',
    title: 'Main Project',
    status: 'Active' as const,
    members: [],
    startDate: '2022-09-22T00:00:00Z',
    endDate: '2022-09-30T00:00:00Z',
    projectProposalUrl: '',
  };
  it('renders header', () => {
    render(<ProjectDetailPage {...defaultProps}></ProjectDetailPage>);
    expect(screen.getByRole('banner')).toBeVisible();
  });
  it('renders the body', () => {
    render(<ProjectDetailPage {...defaultProps}>Body</ProjectDetailPage>);
    expect(screen.getByText('Body')).toBeVisible();
  });
});
