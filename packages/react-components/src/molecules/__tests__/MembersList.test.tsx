import { render } from '@testing-library/react';
import { createUserResponse, createListUserResponse } from '@asap-hub/fixtures';

import MembersList from '../MembersList';

it('renders name and role for each member', async () => {
  const { getAllByRole } = render(
    <MembersList
      members={[
        {
          ...createListUserResponse(1).items[0],
          firstLine: 'Bat Man',
          secondLine: 'Boss',
          thirdLine: [],
        },
        {
          ...createListUserResponse(2).items[1],
          id: '1337',
          firstLine: 'Some One',
          secondLine: 'Apprentice',
          thirdLine: [],
        },
      ]}
    />,
  );
  const items = getAllByRole('listitem');
  expect(items).toHaveLength(2);
  const [batman, someone] = items;
  expect(batman).toHaveTextContent('Bat Man');
  expect(batman).toHaveTextContent('Boss');
  expect(someone).toHaveTextContent('Some One');
  expect(someone).toHaveTextContent('Apprentice');
});

it('only show lab information if the user is on a lab', async () => {
  const { queryAllByText } = render(
    <MembersList
      members={[
        {
          ...createListUserResponse(1).items[0],
          firstLine: 'Bat Man',
          secondLine: 'Boss',
          thirdLine: 'Manchester Lab and Glasgow Lab ',
        },
        {
          ...createListUserResponse(2).items[1],
          id: '1337',
          firstLine: 'Some One',
          secondLine: 'Apprentice',
          thirdLine: [],
        },
      ]}
    />,
  );
  expect(queryAllByText('Manchester Lab and Glasgow Lab')).toHaveLength(1);
});
it('renders a team link for each team provided', async () => {
  const { getByText } = render(
    <MembersList
      members={[
        {
          ...createUserResponse(),
          firstLine: 'Bat Man',
          secondLine: 'Boss',
          thirdLine: [
            {
              displayName: 'DC',
              id: 'dc',
            },
            {
              displayName: 'Arkham',
              id: 'arkham',
            },
          ],
        },
      ]}
    />,
  );
  expect(getByText(/team.dc/i).closest('a')).toHaveAttribute(
    'href',
    expect.stringMatching(/dc$/),
  );
  expect(getByText(/team.arkham/i).closest('a')).toHaveAttribute(
    'href',
    expect.stringMatching(/arkham$/),
  );
});
