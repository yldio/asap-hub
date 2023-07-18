import {
  createInterestGroupResponse,
  createUserResponse,
} from '@asap-hub/fixtures';
import { render } from '@testing-library/react';
import { ComponentProps } from 'react';
import InterestGroupList from '../InterestGroupList';

const props: ComponentProps<typeof InterestGroupList> = {
  id: '',
  interestGroups: [],
};

it('displays member role when not defined as leader', () => {
  const group = createInterestGroupResponse();
  const { getByRole } = render(
    <InterestGroupList
      {...props}
      id="12"
      interestGroups={[
        {
          ...group,
          leaders: [
            {
              ...group.leaders[0],
              role: 'Project Manager',
              user: {
                ...createUserResponse(),
                id: '13',
              },
            },
          ],
        },
      ]}
    />,
  );

  expect(getByRole('listitem').textContent).toMatch(/member/i);
  expect(getByRole('listitem').textContent).not.toMatch(/project manager/i);
});

it('displays member role when defined as leader', () => {
  const group = createInterestGroupResponse();
  const { getByRole } = render(
    <InterestGroupList
      {...props}
      id={'12'}
      interestGroups={[
        {
          ...group,
          leaders: [
            {
              ...group.leaders[0],
              role: 'Project Manager',
              user: {
                ...createUserResponse(),
                id: '12',
              },
            },
          ],
        },
      ]}
    />,
  );

  expect(getByRole('listitem').textContent).not.toMatch(/member/i);
  expect(getByRole('listitem').textContent).toMatch(/project manager/i);
});
