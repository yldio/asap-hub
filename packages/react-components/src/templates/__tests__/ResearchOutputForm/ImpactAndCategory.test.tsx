import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

it('displays impact and category fields when availableAction showImpactAndCategory is true', async () => {
  render(
    <MemoryRouter>
      <ResearchOutputForm
        {...researchOutputFormProps}
        availableActions={{
          ...researchOutputFormProps.availableActions,
          showImpactAndCategory: true,
        }}
      />
    </MemoryRouter>,
  );

  expect(screen.getByText('Impact')).toBeInTheDocument();
  expect(screen.getByText('Category')).toBeInTheDocument();
});

it('renders impact input and does not throw when getImpactSuggestions is noop', async () => {
  render(
    <MemoryRouter>
      <ResearchOutputForm
        {...researchOutputFormProps}
        availableActions={{
          ...researchOutputFormProps.availableActions,
          showImpactAndCategory: true,
        }}
        getImpactSuggestions={() => Promise.resolve([])}
      />
    </MemoryRouter>,
  );

  const impactInput = screen.getByRole('combobox', {
    name: /impact/i,
  });
  expect(impactInput).toBeInTheDocument();
  await userEvent.click(impactInput);
  await userEvent.type(impactInput, 'Test');

  expect(
    screen.queryByText(/no impact options match/i),
  ).not.toBeInTheDocument();
});

it('renders category input and does not throw when getCategorySuggestions is noop', async () => {
  render(
    <MemoryRouter>
      <ResearchOutputForm
        {...researchOutputFormProps}
        availableActions={{
          ...researchOutputFormProps.availableActions,
          showImpactAndCategory: true,
        }}
        getCategorySuggestions={undefined}
      />
    </MemoryRouter>,
  );

  const categoryInput = screen.getByRole('combobox', { name: /category/i });
  expect(categoryInput).toBeInTheDocument();
  await userEvent.click(categoryInput);
  await userEvent.type(categoryInput, 'Test');

  expect(
    screen.queryByText(/no category options match/i),
  ).not.toBeInTheDocument();
});
