import { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import {
  createInterestGroupResponse,
  createListInterestGroupResponse,
} from '@asap-hub/fixtures';

import UserProfileInterestGroups from '../UserProfileInterestGroups';

const props: ComponentProps<typeof UserProfileInterestGroups> = {
  firstName: '',
  id: '',
  interestGroups: [],
};

it('render a heading', () => {
  const { getByText } = render(
    <UserProfileInterestGroups {...props} firstName="Phillip" />,
  );

  expect(
    getByText(/phillip/i, { selector: 'h2' }).textContent,
  ).toMatchInlineSnapshot(`"Phillip’s Groups"`);
  expect(
    getByText(/phillip/i, { selector: 'p' }).textContent,
  ).toMatchInlineSnapshot(
    `"Phillip’s team is collaborating with other teams via groups, which meet frequently"`,
  );
});

it('renders one group', () => {
  const { getByRole } = render(
    <UserProfileInterestGroups
      {...props}
      interestGroups={[
        {
          ...createInterestGroupResponse({}, 1),
          name: 'Group 1',
          id: 'g1',
        },
      ]}
    />,
  );

  expect(getByRole('link').textContent).toEqual('Group 1');
  expect(getByRole('link').getAttribute('href')).toMatch(/g1$/);
});

it('renders a list of groups', () => {
  const { getAllByRole } = render(
    <UserProfileInterestGroups
      {...props}
      interestGroups={createListInterestGroupResponse(3).items}
    />,
  );

  expect(getAllByRole('listitem').length).toEqual(3);
});
