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
