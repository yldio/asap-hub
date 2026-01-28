import { researchOutputDocumentTypes } from '@asap-hub/model';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import ResearchOutputForm from '../../ResearchOutputForm';
import { defaultProps } from '../../test-utils/research-output-form';

const getCategorySuggestionsMock = jest.fn();

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation();
  getCategorySuggestionsMock.mockResolvedValue([
    { label: 'Category 3', value: 'category-3' },
  ]);
});

afterEach(() => {
  jest.resetAllMocks();
});

it('displays impact and category fields when document type is Article', async () => {
  render(
    <MemoryRouter>
      <ResearchOutputForm {...defaultProps} documentType="Article" />
    </MemoryRouter>,
  );

  expect(screen.getByText('Impact')).toBeInTheDocument();
  expect(screen.getByText('Category')).toBeInTheDocument();
});

const notArticleDocumentTypes = researchOutputDocumentTypes.filter(
  (type) => type !== 'Article',
);

it.each(notArticleDocumentTypes)(
  'does not display impact and category fields when document type is %s',
  async (documentType) => {
    render(
      <MemoryRouter>
        <ResearchOutputForm {...defaultProps} documentType={documentType} />
      </MemoryRouter>,
    );

    expect(screen.queryByText('Impact')).not.toBeInTheDocument();
    expect(screen.queryByText('Category')).not.toBeInTheDocument();
  },
);

it('renders impact input and does not throw when getImpactSuggestions is noop', async () => {
  render(
    <MemoryRouter>
      <ResearchOutputForm
        {...defaultProps}
        documentType="Article"
        getImpactSuggestions={() => Promise.resolve([])}
      />
    </MemoryRouter>,
  );

  const impactInput = screen.getByRole('combobox', { name: /impact/i });
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
        {...defaultProps}
        documentType="Article"
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
