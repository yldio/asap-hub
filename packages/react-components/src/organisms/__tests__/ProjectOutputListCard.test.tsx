import { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import { createResearchOutputResponse } from '@asap-hub/fixtures';

import ProjectOutputListCard from '../ProjectOutputListCard';

const baseProps: ComponentProps<typeof ProjectOutputListCard> = {
  researchOutputs: [],
};

it('renders one entry per research output', () => {
  const { getAllByRole } = render(
    <ProjectOutputListCard
      {...baseProps}
      researchOutputs={[
        {
          ...createResearchOutputResponse(0),
          source: 'team',
          title: 'Output 1',
        },
        {
          ...createResearchOutputResponse(1),
          source: 'team',
          title: 'Output 2',
        },
      ]}
    />,
  );
  expect(getAllByRole('heading').map(({ textContent }) => textContent)).toEqual(
    ['Output 1', 'Output 2'],
  );
});

it('links each title to the research output detail page', () => {
  const { getByRole } = render(
    <ProjectOutputListCard
      {...baseProps}
      researchOutputs={[
        {
          ...createResearchOutputResponse(0),
          source: 'team',
          title: 'Output 1',
          id: '123',
        },
      ]}
    />,
  );
  expect(getByRole('heading').closest('a')).toHaveAttribute(
    'href',
    expect.stringMatching(/123/i),
  );
});
