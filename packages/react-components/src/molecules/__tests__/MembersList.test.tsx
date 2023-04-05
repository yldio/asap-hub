import { render } from '@testing-library/react';
import { createUserResponse, createListUserResponse } from '@asap-hub/fixtures';

import MembersList from '../MembersList';

it('renders first, second and third line for each member', async () => {
  const { getAllByRole } = render(
    <MembersList
      members={[
        {
          ...createListUserResponse(1).items[0]!,
          firstLine: 'Bat Man',
          secondLine: 'Boss',
          thirdLine: 'Multiple Teams',
        },
        {
          ...createListUserResponse(2).items[1],
          id: '1337',
          firstLine: 'Some One',
          secondLine: 'Apprentice',
          thirdLine: 'Multiple Teams',
        },
      ]}
    />,
  );
  const items = getAllByRole('listitem');
  expect(items).toHaveLength(2);
  const [batman, someone] = items;
  expect(batman).toHaveTextContent('Bat Man');
  expect(batman).toHaveTextContent('Boss');
  expect(batman).toHaveTextContent('Multiple Teams');
  expect(someone).toHaveTextContent('Some One');
  expect(someone).toHaveTextContent('Apprentice');
  expect(someone).toHaveTextContent('Multiple Teams');
});

it('only shows thirdLine if the user has that data', async () => {
  const { getAllByRole } = render(
    <MembersList
      members={[
        {
          ...createListUserResponse(1).items[0]!,
          firstLine: 'Bat Man',
          secondLine: 'Boss',
          thirdLine: 'Manchester Lab and Glasgow Lab',
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
  expect(batman).toHaveTextContent('Manchester Lab and Glasgow Lab');
  expect(someone).not.toHaveTextContent('Lab');
});

it('renders a team link if a teamList is provided for thirdLine', async () => {
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
          ],
        },
      ]}
    />,
  );
  expect(getByText(/team.dc/i).closest('a')).toHaveAttribute(
    'href',
    expect.stringMatching(/dc$/),
  );
});

it('accepts undefined value for second and third line', async () => {
  const { getAllByRole } = render(
    <MembersList
      members={[
        {
          ...createListUserResponse(1).items[0]!,
          firstLine: 'example',
        },
      ]}
    />,
  );
  const items = getAllByRole('listitem');
  expect(items).toHaveLength(1);
  const [user] = items;
  expect(user).toHaveTextContent('AK');
});

it('renders alumni badge when there is an alumni member', async () => {
  const { queryByTitle, rerender } = render(
    <MembersList
      members={[
        {
          ...createListUserResponse(1).items[0]!,
          firstLine: 'example',
          alumniSinceDate: '2022-10-27',
        },
      ]}
    />,
  );

  expect(queryByTitle('Alumni Badge')).toBeInTheDocument();

  rerender(
    <MembersList
      members={[
        {
          ...createListUserResponse(1).items[0]!,
          firstLine: 'example',
          alumniSinceDate: undefined,
        },
      ]}
    />,
  );

  expect(queryByTitle('Alumni Badge')).not.toBeInTheDocument();
});

it('overrides user link based on based on the overrideUserRoute prop fn', () => {
  const overrideUserRouteMock = jest
    .fn()
    .mockImplementation((_) => ({ $: 'some route' }));
  render(
    <MembersList
      members={[
        {
          ...createListUserResponse(1).items[0]!,
          firstLine: 'example',
        },
      ]}
      userRoute={overrideUserRouteMock}
    />,
  );

  expect(overrideUserRouteMock).toHaveBeenLastCalledWith({
    userId: 'user-id-0',
  });
});
