import { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import { createResearchOutputResponse } from '@asap-hub/fixtures';

import ProjectOutputBody from '../ProjectOutputBody';

const baseProps: ComponentProps<typeof ProjectOutputBody> = {
  ...createResearchOutputResponse(),
  variant: 'card',
  source: 'team',
};

it('defaults showTags to true when omitted', () => {
  const { getByText } = render(
    <ProjectOutputBody {...baseProps} keywords={['Etag']} />,
  );
  expect(getByText('Etag')).toBeVisible();
});

it('renders external author display name', () => {
  const { getByText } = render(
    <ProjectOutputBody
      {...baseProps}
      authors={[{ id: 'ext-1', displayName: 'External Author' }]}
    />,
  );
  expect(getByText('External Author')).toBeVisible();
});

it('renders alumni badge for internal authors with alumniSinceDate', () => {
  const { getByTitle } = render(
    <ProjectOutputBody
      {...baseProps}
      authors={[
        {
          id: 'u1',
          firstName: 'John',
          lastName: 'Doe',
          displayName: 'John Doe',
          avatarUrl: undefined,
          alumniSinceDate: '2020-01-01',
        },
      ]}
    />,
  );
  expect(getByTitle('Alumni Member')).toBeInTheDocument();
});

it('renders author overflow counter when authors exceed max', () => {
  const authors = Array.from({ length: 5 }, (_, i) => ({
    id: `u${i}`,
    firstName: `First${i}`,
    lastName: `Last${i}`,
    displayName: `First${i} Last${i}`,
    avatarUrl: undefined,
  }));
  const { getByText } = render(
    <ProjectOutputBody {...baseProps} authors={authors} />,
  );
  expect(getByText('+2')).toBeVisible();
  expect(getByText('Authors')).toBeVisible();
});
