import { render, screen } from '@testing-library/react';
import ProjectDetailPage from '../ProjectDetailPage';

describe('ProjectDetailPage', () => {
  const defaultProps = {
    backHref: '/back',
    title: 'Project',
    members: [],
    id: '1',
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
