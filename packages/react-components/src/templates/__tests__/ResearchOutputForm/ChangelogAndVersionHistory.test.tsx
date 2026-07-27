import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import ResearchOutputForm from '../../ResearchOutputForm';
import { getDefaultProps } from '../../test-utils/research-output-form';

let researchOutputFormProps: ReturnType<typeof getDefaultProps>;

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation();
  researchOutputFormProps = getDefaultProps();
});

afterEach(() => {
  jest.resetAllMocks();
});

it('displays changelog when availableAction showChangelogAndVersionHistory is true', () => {
  render(
    <MemoryRouter>
      <ResearchOutputForm
        {...researchOutputFormProps}
        availableActions={{
          ...researchOutputFormProps.availableActions,
          showChangelogAndVersionHistory: true,
        }}
      />
    </MemoryRouter>,
  );

  expect(screen.getByRole('textbox', { name: /changelog/i })).toBeVisible();
});

it('hides changelog when availableAction showChangelogAndVersionHistory is false', () => {
  render(
    <MemoryRouter>
      <ResearchOutputForm
        {...researchOutputFormProps}
        availableActions={{
          ...researchOutputFormProps.availableActions,
          showChangelogAndVersionHistory: false,
        }}
      />
    </MemoryRouter>,
  );

  expect(
    screen.queryByRole('textbox', { name: /changelog/i }),
  ).not.toBeInTheDocument();
});
