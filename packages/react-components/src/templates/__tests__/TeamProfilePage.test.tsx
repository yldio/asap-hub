import { render, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import TeamProfilePage from '../TeamProfilePage';

const boilerplateProps: Omit<
  ComponentProps<typeof TeamProfilePage>,
  'children'
> = {
  id: '42',
  teamId: 'TI1',
  grantId: '000123',
  projectTitle: 'Unknown',
  teamType: 'Discovery Team',
  displayName: 'Doe, J',
  lastModifiedDate: new Date(2020, 6, 12, 14, 32).toISOString(),
  members: [],
  tags: [],
  teamListElementId: '',
  labCount: 15,
  upcomingEventsCount: 0,
  isStaff: false,
  teamStatus: 'Active',
  labs: [],
};

it('renders the header', () => {
  const { getByText } = render(
    <TeamProfilePage {...boilerplateProps}>Tab Content</TeamProfilePage>,
  );
  expect(getByText('Team Doe, J')).toBeVisible();
});

it('renders the inactive team header for inactive team', () => {
  const { getByText, getByTitle } = render(
    <TeamProfilePage
      {...boilerplateProps}
      inactiveSince="2022-09-30T09:00:00Z"
    />,
  );
  expect(
    getByText(
      'This team is inactive and might not have all content available.',
    ),
  ).toBeVisible();
  expect(getByTitle('Warning')).toBeInTheDocument();
});

it('does not render the inactive team header for active team', () => {
  const { queryByText } = render(
    <TeamProfilePage {...boilerplateProps} inactiveSince={undefined} />,
  );
  expect(
    queryByText(
      'This team is inactive and might not have all content available.',
    ),
  ).not.toBeInTheDocument();
});

describe('project banner', () => {
  const bannerText = /The workspace and outputs have moved/i;
  const projectProps = {
    linkedProjectId: 'project-1',
    projectType: 'Discovery Project' as const,
    projectTitle: 'Project Alpha',
  };

  it('renders the banner with a link to the associated project', () => {
    const { getByText } = render(
      <TeamProfilePage
        {...boilerplateProps}
        {...projectProps}
        showProjectBanner
        onDismissProjectBanner={jest.fn()}
      />,
    );
    const banner = getByText(bannerText).closest('section') as HTMLElement;
    expect(banner).toBeVisible();
    expect(
      within(banner).getByRole('link', { name: 'Project Alpha' }),
    ).toHaveAttribute('href', '/projects/discovery/project-1');
  });

  it('calls onDismissProjectBanner when the close button is clicked', async () => {
    const onDismissProjectBanner = jest.fn();
    const { getByLabelText } = render(
      <TeamProfilePage
        {...boilerplateProps}
        {...projectProps}
        showProjectBanner
        onDismissProjectBanner={onDismissProjectBanner}
      />,
    );
    await userEvent.click(getByLabelText('Close'));
    expect(onDismissProjectBanner).toHaveBeenCalled();
  });

  it('does not render the banner when showProjectBanner is false', () => {
    const { queryByText } = render(
      <TeamProfilePage {...boilerplateProps} {...projectProps} />,
    );
    expect(queryByText(bannerText)).not.toBeInTheDocument();
  });

  it('does not render the banner when the team has no linked project', () => {
    const { queryByText } = render(
      <TeamProfilePage
        {...boilerplateProps}
        showProjectBanner
        onDismissProjectBanner={jest.fn()}
      />,
    );
    expect(queryByText(bannerText)).not.toBeInTheDocument();
  });
});

it('renders the children', () => {
  const { getByText } = render(
    <TeamProfilePage {...boilerplateProps}>Tab Content</TeamProfilePage>,
  );
  expect(getByText('Tab Content')).toBeVisible();
});
