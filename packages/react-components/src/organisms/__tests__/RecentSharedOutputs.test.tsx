import { render } from '@testing-library/react';
import { createResearchOutputResponse } from '@asap-hub/fixtures';

import RecentSharedOutputs from '../RecentSharedOutputs';
import { formatDateToTimezone } from '../../date';

const date = '2020-01-01';

it('renders the table research outputs', () => {
  const { getByText, getByRole, getByTitle } = render(
    <RecentSharedOutputs
      outputs={[
        {
          ...createResearchOutputResponse(),
          title: 'Test title',
          addedDate: date,
          documentType: 'Article',
        },
      ]}
    />,
  );
  expect(getByRole('link', { name: 'Test title' })).toBeVisible();
  expect(getByTitle('Article')).toBeInTheDocument();
  expect(
    getByText(formatDateToTimezone(date, 'E, d MMM y').toUpperCase()),
  ).toBeVisible();
});

it('falls back to created date if addedDate is undefined', () => {
  const { getByText } = render(
    <RecentSharedOutputs
      outputs={[
        {
          ...createResearchOutputResponse(),
          addedDate: undefined,
          created: '2022-01-01',
        },
      ]}
    />,
  );
  expect(
    getByText(formatDateToTimezone('2022-01-01', 'E, d MMM y').toUpperCase()),
  ).toBeVisible();
});
