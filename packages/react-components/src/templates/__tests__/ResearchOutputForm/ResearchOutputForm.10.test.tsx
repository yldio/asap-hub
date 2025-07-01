import { researchOutputDocumentTypes } from '@asap-hub/model';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory, History } from 'history';
import { Router } from 'react-router-dom';

import ResearchOutputForm from '../../ResearchOutputForm';
import { defaultProps } from '../../test-utils/research-output-form';

let history!: History;

const getCategorySuggestionsMock = jest.fn();

beforeEach(() => {
  history = createMemoryHistory();
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
    <Router history={history}>
      <ResearchOutputForm {...defaultProps} documentType="Article" />
    </Router>,
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
      <Router history={history}>
        <ResearchOutputForm {...defaultProps} documentType={documentType} />
      </Router>,
    );

    expect(screen.queryByText('Impact')).not.toBeInTheDocument();
    expect(screen.queryByText('Category')).not.toBeInTheDocument();
  },
);

it('renders impact input and does not throw when getImpactSuggestions is noop', async () => {
  render(
    <Router history={history}>
      <ResearchOutputForm
        {...defaultProps}
        documentType="Article"
        getImpactSuggestions={() => Promise.resolve([])}
      />
    </Router>,
  );

  const impactInput = screen.getByRole('textbox', { name: /impact/i });
  expect(impactInput).toBeInTheDocument();
  userEvent.click(impactInput);
  userEvent.type(impactInput, 'Test');

  expect(
    screen.queryByText(/no impact options match/i),
  ).not.toBeInTheDocument();
});

it('renders category input and does not throw when getCategorySuggestions is noop', async () => {
  render(
    <Router history={history}>
      <ResearchOutputForm
        {...defaultProps}
        documentType="Article"
        getCategorySuggestions={undefined}
      />
    </Router>,
  );

  const categoryInput = screen.getByRole('textbox', { name: /category/i });
  expect(categoryInput).toBeInTheDocument();
  userEvent.click(categoryInput);
  userEvent.type(categoryInput, 'Test');

  expect(
    screen.queryByText(/no category options match/i),
  ).not.toBeInTheDocument();
});
