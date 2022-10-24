import { ComponentProps } from 'react';
import { createUserResponse } from '@asap-hub/fixtures';
import { render, screen } from '@testing-library/react';
import LeadersTabbedCard from '../LeadersTabbedCard';

const props: ComponentProps<typeof LeadersTabbedCard> = {
  leaders: [],
  title: '',
};
it('renders the leaders tabbed card', () => {
  render(
    <LeadersTabbedCard
      {...props}
      leaders={[
        {
          user: { ...createUserResponse(), displayName: 'Octavian' },
          role: 'Project Manager',
        },
      ]}
      title="Leaders title"
    />,
  );
  expect(screen.getByRole('heading').textContent).toEqual('Leaders title');
  expect(screen.getByText('Past Leaders (1)')).toBeVisible();
  expect(screen.getByText(/Octavian/)).toBeVisible();
  expect(screen.getByText(/Project Manager/)).toBeVisible();
});
