import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import { createResearchOutputResponse } from '@asap-hub/fixtures';

import SharedResearchOutput from '../SharedResearchOutput';

const props: ComponentProps<typeof SharedResearchOutput> = {
  ...createResearchOutputResponse(),
  backHref: '#',
};
it('renders an output with title and content', () => {
  const { getByText } = render(
    <SharedResearchOutput
      {...props}
      type="Protocol"
      title="title"
      description="content"
    />,
  );
  expect(getByText(/protocol/i)).toBeVisible();
  expect(getByText(/title/i, { selector: 'h1' })).toBeVisible();
  expect(getByText(/content/i)).toBeVisible();
});

it('renders an output with tags', () => {
  const { getByText } = render(
    <SharedResearchOutput {...props} type="Protocol" tags={['Example Tag']} />,
  );
  expect(getByText(/example tag/i)).toBeVisible();
});
