import { Aim } from '@asap-hub/model';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Suspense } from 'react';
import { StaticRouter } from 'react-router';
import CreateMilestoneModal from '../CreateMilestoneModal';

const mockAims: Aim[] = [
  {
    id: '1',
    order: 1,
    description: 'Aim Description One',
    status: 'In Progress',
    articleCount: 0,
  },
  {
    id: '2',
    order: 2,
    description: 'Aim Description Two',
    status: 'Complete',
    articleCount: 2,
  },
];

const mockArticles = [
  {
    label: 'Project Article 1',
    value: 'article-1',
    type: 'Preprint',
    documentType: 'Article',
  },
];

const renderComponent = async (overrides = {}) => {
  const onCancel = jest.fn();
  const onSubmit = jest.fn().mockResolvedValue(undefined);
  const getArticleSuggestions = jest.fn().mockResolvedValue(mockArticles);

  const container = render(
    <StaticRouter location="/">
      <Suspense fallback={<div>Loading...</div>}>
        <CreateMilestoneModal
          grantType="supplement"
          aims={mockAims}
          onCancel={onCancel}
          onSubmit={onSubmit}
          getArticleSuggestions={getArticleSuggestions}
          {...overrides}
        />
      </Suspense>
    </StaticRouter>,
  );
  await waitFor(() => {
    expect(container.queryByText(/Loading.../i)).not.toBeInTheDocument();
  });

  return { onCancel, onSubmit, getArticleSuggestions };
};

describe('CreateMilestoneModal', () => {
  it('renders the form', async () => {
    await renderComponent();

    expect(screen.getByText(/Add New Milestone/i)).toBeInTheDocument();

    expect(screen.getByText(/Grant Type/i)).toBeInTheDocument();

    expect(
      screen.getByRole('textbox', { name: /Milestone Description/i }),
    ).toBeInTheDocument();
  });

  it('loads and selects related articles', async () => {
    const { getArticleSuggestions } = await renderComponent();

    const relatedArticlesLabel = screen
      .getByText('Related Articles')
      .closest('div')!;

    const input = within(relatedArticlesLabel).getByRole('combobox');

    await userEvent.click(input);
    await userEvent.type(input, 'Project');

    await waitFor(() => {
      expect(getArticleSuggestions).toHaveBeenCalled();
    });

    const option = await screen.findByText('Project Article 1');

    await userEvent.click(option);
    expect(screen.getByText('Project Article 1')).toBeInTheDocument();
  });

  it('opens confirmation modal when form is valid', async () => {
    await renderComponent();
    await userEvent.type(
      screen.getByRole('textbox', { name: /Milestone Description/i }),
      'Some description',
    );

    await userEvent.click(screen.getByRole('button', { name: '#1' }));

    await userEvent.click(screen.getByRole('button', { name: /^confirm$/i }));

    expect(
      await screen.findByText(/Confirm Milestone Creation/i),
    ).toBeInTheDocument();
  });

  it('submits data after confirmation', async () => {
    const { onSubmit } = await renderComponent();

    await userEvent.type(
      screen.getByRole('textbox', { name: /Milestone Description/i }),
      'Some description',
    );

    await userEvent.click(screen.getByRole('button', { name: '#1' }));

    const relatedArticlesLabel = screen
      .getByText('Related Articles')
      .closest('div')!;
    const input = within(relatedArticlesLabel).getByRole('combobox');
    await userEvent.click(input);
    await userEvent.type(input, 'Project');

    const articleOption = await screen.findByText('Project Article 1');
    await userEvent.click(articleOption);

    const statusDropdown = screen.getByRole('combobox', {
      name: /Milestone status/i,
    });
    await userEvent.click(statusDropdown);
    const statusOption = await screen.findByText(/In Progress/i);
    await userEvent.click(statusOption);

    await userEvent.click(screen.getByRole('button', { name: /^confirm$/i }));

    const confirmButton = await screen.findByRole('button', {
      name: /confirm and notify/i,
    });

    await userEvent.click(confirmButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          description: 'Some description',
          aimIds: ['1'],
          relatedArticleIds: ['article-1'],
          status: 'In Progress',
        }),
      );
    });
  });

  it('calls onCancel when cancel button is clicked', async () => {
    const { onCancel } = await renderComponent();

    await userEvent.click(screen.getByRole('button', { name: /cancel/i }));

    expect(onCancel).toHaveBeenCalled();
  });

  it('returns to form when cancelling confirm modal', async () => {
    await renderComponent();

    await userEvent.type(
      screen.getByRole('textbox', { name: /Milestone Description/i }),
      'Some description',
    );

    await userEvent.click(screen.getByRole('button', { name: '#1' }));

    await userEvent.click(screen.getByRole('button', { name: /^confirm$/i }));

    expect(
      await screen.findByText(/Confirm Milestone Creation/i),
    ).toBeInTheDocument();

    await userEvent.click(
      screen.getByRole('button', { name: /keep editing/i }),
    );
    expect(screen.getByText(/Add New Milestone/i)).toBeInTheDocument();
  });

  it('shows "no articles match" message when there are no matching articles', async () => {
    const getArticleSuggestions = jest.fn().mockResolvedValue([]);

    await renderComponent({ getArticleSuggestions });

    const relatedField = screen.getByText('Related Articles').closest('div')!;

    const input = within(relatedField).getByRole('combobox');

    await userEvent.click(input);
    await userEvent.type(input, 'Unknown');

    expect(
      await screen.findByText(/Sorry, no articles match Unknown/i),
    ).toBeInTheDocument();
  });

  it('shows "no status matches" message when filtering status', async () => {
    await renderComponent();

    const statusDropdown = screen.getByRole('combobox', {
      name: /Milestone status/i,
    });

    await userEvent.click(statusDropdown);
    await userEvent.type(statusDropdown, 'NotARealStatus');

    expect(
      await screen.findByText(/Sorry, no status matches NotARealStatus/i),
    ).toBeInTheDocument();
  });
});
