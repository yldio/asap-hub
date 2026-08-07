import { researchTagSubtypeResponse } from '@asap-hub/fixtures';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { editorRef } from '../../atoms';
import { mockActErrorsInConsole } from '../../test-utils';
import ResearchOutputFormSharingCard from '../ResearchOutputFormSharingCard';
import { renderWithResearchOutputForm } from '../test-utils/research-output-form';

const defaultProps: ComponentProps<typeof ResearchOutputFormSharingCard> = {
  disableImpactAndCategory: false,
  showImpactAndCategory: false,
  showChangelogAndVersionHistory: true,
  researchTags: [],
  typeOptions: [],
  getShortDescriptionFromDescription: jest.fn(),
  getImpactSuggestions: jest.fn().mockResolvedValue([]),
  getCategorySuggestions: jest.fn().mockResolvedValue([]),
};

let consoleMock: ReturnType<typeof mockActErrorsInConsole>;
beforeEach(() => {
  consoleMock = mockActErrorsInConsole();
});
afterEach(() => {
  consoleMock.mockRestore();
});

describe('base sharing fields', () => {
  it('renders the card with provided values', () => {
    renderWithResearchOutputForm(
      <ResearchOutputFormSharingCard
        {...defaultProps}
        typeOptions={['Preprint', '3D Printing']}
      />,
      {
        defaultValues: {
          descriptionMD: 'description text',
          link: 'http://example.com',
          title: 'title',
          type: 'Preprint',
        },
      },
    );
    expect(screen.getAllByText('description text')[0]).toBeVisible();
    expect(screen.getByDisplayValue('http://example.com')).toBeVisible();
    expect(screen.getByDisplayValue('title')).toBeVisible();
    expect(screen.getByText('Preprint')).toBeVisible();
  });

  it.each`
    title      | label       | error
    ${'Url'}   | ${/URL/i}   | ${'Please enter a valid URL, starting with http://'}
    ${'Title'} | ${/title/i} | ${'Please enter a title.'}
    ${'Type'}  | ${/type/i}  | ${'Please choose a type.'}
  `(
    'shows error message for missing value $title',
    async ({ label, error }) => {
      const { findByText } = renderWithResearchOutputForm(
        <ResearchOutputFormSharingCard
          {...defaultProps}
          urlRequired
          typeOptions={['3D Printing']}
        />,
      );
      const input = screen.getByLabelText(label);
      await userEvent.click(input);
      await userEvent.tab();
      expect(await findByText(error)).toBeVisible();
    },
  );

  it('does not require an url', async () => {
    renderWithResearchOutputForm(
      <ResearchOutputFormSharingCard {...defaultProps} urlRequired={false} />,
    );
    expect(
      await screen.findByText(
        (content, node) =>
          (content === 'URL' &&
            node?.nextSibling?.textContent?.includes('(optional)')) ??
          false,
      ),
    ).toBeVisible();

    const input = screen.getByLabelText(/URL/i);
    fireEvent.focusOut(input);
    await expect(
      screen.findByText('Please enter a valid URL, starting with http://'),
    ).rejects.toThrow();
  });

  it.each`
    field      | label       | formField
    ${'Url'}   | ${/URL/i}   | ${'link'}
    ${'Title'} | ${/title/i} | ${'title'}
  `('triggers an onchange event for $field', async ({ label, formField }) => {
    const { methodsRef } = renderWithResearchOutputForm(
      <ResearchOutputFormSharingCard {...defaultProps} />,
    );
    const input = screen.getByLabelText(label);
    fireEvent.change(input, { target: { value: 'test' } });
    expect(methodsRef.current?.getValues(formField)).toEqual('test');
  });

  it('triggers an onchange event for Description', async () => {
    const { methodsRef } = renderWithResearchOutputForm(
      <ResearchOutputFormSharingCard {...defaultProps} />,
    );
    await waitFor(() => expect(editorRef.current).not.toBeNull());

    editorRef.current?.focus();
    const input = screen.getByTestId('editor');

    await userEvent.click(input);
    await userEvent.tab();
    fireEvent.input(input, { data: 'test' });

    await waitFor(() => {
      expect(methodsRef.current?.getValues('descriptionMD')).toEqual('test');
    });
  });

  it('triggers an onchange event for Short Description', async () => {
    const { methodsRef } = renderWithResearchOutputForm(
      <ResearchOutputFormSharingCard {...defaultProps} />,
    );
    const input = screen.getByRole('textbox', { name: /short description/i });
    fireEvent.change(input, { target: { value: 'test' } });
    await waitFor(() => {
      expect(methodsRef.current?.getValues('shortDescription')).toEqual('test');
    });
  });

  it('triggers an on change for type', async () => {
    const { methodsRef } = renderWithResearchOutputForm(
      <ResearchOutputFormSharingCard
        {...defaultProps}
        typeOptions={['Preprint', '3D Printing', 'ASAP subgroup meeting']}
      />,
    );

    const type = screen.getByLabelText(/type/i);
    await userEvent.type(type, 'Preprint');
    await userEvent.type(type, '{Enter}');

    expect(methodsRef.current?.getValues('type')).toEqual('Preprint');
  });

  it('triggers an on change for subtype', async () => {
    const { methodsRef } = renderWithResearchOutputForm(
      <ResearchOutputFormSharingCard
        {...defaultProps}
        researchTags={[researchTagSubtypeResponse]}
      />,
    );

    const type = screen.getByLabelText(/subtype/i);
    await userEvent.type(type, 'Metabolite');
    await userEvent.type(type, '{Enter}');

    expect(methodsRef.current?.getValues('subtype')).toEqual('Metabolite');
  });

  it('shows the custom no options message for type', async () => {
    renderWithResearchOutputForm(
      <ResearchOutputFormSharingCard
        {...defaultProps}
        typeOptions={['ASAP annual meeting', '3D Printing']}
      />,
    );

    await userEvent.type(screen.getByLabelText(/type/i), 'asdflkjasdflkj');

    expect(
      screen.getByText('Sorry, no types match asdflkjasdflkj'),
    ).toBeVisible();
  });
});

describe('Changelog validation', () => {
  it('shows validation message when changelog is empty', async () => {
    renderWithResearchOutputForm(
      <ResearchOutputFormSharingCard {...defaultProps} />,
    );

    const changelogInput = screen.getByRole('textbox', { name: /changelog/i });
    fireEvent.change(changelogInput, { target: { value: '  ' } });
    fireEvent.blur(changelogInput);

    expect(screen.queryByText(/manuscript/i)).not.toBeInTheDocument();

    expect(
      await screen.findByText('Please enter a changelog'),
    ).toBeInTheDocument();
  });

  it('shows validation message when changelog exceeds 250 characters', async () => {
    renderWithResearchOutputForm(
      <ResearchOutputFormSharingCard {...defaultProps} />,
    );

    const longText = 'a'.repeat(251);
    const changelogInput = screen.getByRole('textbox', { name: /changelog/i });
    fireEvent.change(changelogInput, { target: { value: longText } });
    fireEvent.blur(changelogInput);

    expect(
      await screen.findByText(
        'The changelog exceeds the character limit. Please limit it to 250 characters.',
      ),
    ).toBeInTheDocument();
  });

  it('clears validation message when changelog is valid', async () => {
    renderWithResearchOutputForm(
      <ResearchOutputFormSharingCard {...defaultProps} />,
    );

    const validText = 'a'.repeat(100);
    const changelogInput = screen.getByRole('textbox', { name: /changelog/i });
    fireEvent.change(changelogInput, { target: { value: validText } });
    fireEvent.blur(changelogInput);

    expect(
      screen.queryByText('Please enter a changelog'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        'The changelog exceeds the character limit. Please limit it to 250 characters.',
      ),
    ).not.toBeInTheDocument();
  });
});

describe('impact and category', () => {
  it('renders the impact and categories', async () => {
    const loadOptions = jest.fn();
    loadOptions.mockResolvedValue([]);
    renderWithResearchOutputForm(
      <ResearchOutputFormSharingCard
        {...defaultProps}
        showImpactAndCategory={true}
        getImpactSuggestions={loadOptions}
        getCategorySuggestions={loadOptions}
      />,
    );

    const impactInput = screen.getByRole('combobox', { name: /impact/i });
    expect(impactInput).toBeInTheDocument();

    const categoryInput = screen.getByRole('combobox', { name: /category/i });
    expect(categoryInput).toBeInTheDocument();

    expect(screen.queryByText(/manuscript/i)).not.toBeInTheDocument();

    fireEvent.change(categoryInput, { target: { value: 'Category' } });

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    expect(
      screen.getByText(/no category options match Category/i),
    ).toBeInTheDocument();
  });

  it('renders the category field with default callbacks without crashing', async () => {
    renderWithResearchOutputForm(
      <ResearchOutputFormSharingCard
        {...defaultProps}
        showImpactAndCategory={true}
        getCategorySuggestions={undefined}
      />,
    );

    const categoryInput = screen.getByRole('combobox', { name: /category/i });
    expect(categoryInput).toBeInTheDocument();

    fireEvent.change(categoryInput, { target: { value: 'Test' } });

    await waitFor(() => {
      expect(
        screen.queryByText(/no category options match/i),
      ).not.toBeInTheDocument();
    });
  });

  it('calls onChangeCategories when a category is selected', async () => {
    const getCategorySuggestions = jest
      .fn()
      .mockResolvedValue([{ label: 'Cat 1', value: 'cat1' }]);

    const { methodsRef } = renderWithResearchOutputForm(
      <ResearchOutputFormSharingCard
        {...defaultProps}
        showImpactAndCategory={true}
        getCategorySuggestions={getCategorySuggestions}
      />,
    );

    const categoryInput = screen.getByRole('combobox', { name: /category/i });
    fireEvent.change(categoryInput, { target: { value: 'Cat' } });

    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
    );

    fireEvent.keyDown(categoryInput, { key: 'ArrowDown' });
    fireEvent.keyDown(categoryInput, { key: 'Enter' });

    expect(methodsRef.current?.getValues('categories')).toEqual([
      { label: 'Cat 1', value: 'cat1' },
    ]);
  });

  it('shows validation message when no category is selected', async () => {
    renderWithResearchOutputForm(
      <ResearchOutputFormSharingCard
        {...defaultProps}
        showImpactAndCategory={true}
      />,
      { defaultValues: { categories: [] } },
    );

    const categoryInput = screen.getByRole('combobox', { name: /category/i });
    await userEvent.click(categoryInput);
    await userEvent.tab();

    expect(
      await screen.findByText('Please add at least one category.'),
    ).toBeVisible();
  });

  it('shows validation message when more than two categories are selected', async () => {
    const getCategorySuggestions = jest
      .fn()
      .mockResolvedValue([{ label: 'Cat 3', value: 'cat3' }]);

    renderWithResearchOutputForm(
      <ResearchOutputFormSharingCard
        {...defaultProps}
        showImpactAndCategory={true}
        getCategorySuggestions={getCategorySuggestions}
      />,
      {
        defaultValues: {
          categories: [
            { label: 'Cat 1', value: 'cat1' },
            { label: 'Cat 2', value: 'cat2' },
          ],
        },
      },
    );

    const categoryInput = screen.getByRole('combobox', { name: /category/i });
    expect(categoryInput).toBeInTheDocument();

    fireEvent.change(categoryInput, { target: { value: 'Cat' } });

    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
    );

    fireEvent.keyDown(categoryInput, { key: 'ArrowDown' });
    fireEvent.keyDown(categoryInput, { key: 'Enter' });

    fireEvent.blur(categoryInput);

    expect(
      await screen.findByText('You can select up to two categories only.'),
    ).toBeInTheDocument();

    fireEvent.click(screen.getAllByTitle(/close/i)[0]!);
    fireEvent.blur(categoryInput);

    await waitFor(() =>
      expect(
        screen.queryByText('You can select up to two categories only.'),
      ).not.toBeInTheDocument(),
    );
  });

  it('disables impact and category fields when disableImpactAndCategory is true', () => {
    const loadOptions = jest.fn();
    loadOptions.mockResolvedValue([]);

    const { rerender } = renderWithResearchOutputForm(
      <ResearchOutputFormSharingCard
        {...defaultProps}
        disableImpactAndCategory={true}
        showImpactAndCategory={true}
        getImpactSuggestions={loadOptions}
        getCategorySuggestions={loadOptions}
      />,
    );
    expect(screen.getByLabelText(/impact\(required\)/i)).toBeDisabled();
    expect(screen.getByLabelText(/category/i)).toBeDisabled();

    rerender(
      <ResearchOutputFormSharingCard
        {...defaultProps}
        disableImpactAndCategory={false}
        showImpactAndCategory={true}
        getImpactSuggestions={loadOptions}
        getCategorySuggestions={loadOptions}
      />,
    );
    expect(screen.getByLabelText(/impact\(required\)/i)).toBeEnabled();
    expect(screen.getByLabelText(/category/i)).toBeEnabled();
  });

  it('calls onChangeImpact with the correct option when an impact is selected', async () => {
    const impactOptions = [
      { label: 'High Impact', value: 'high' },
      { label: 'Low Impact', value: 'low' },
    ];
    const getImpactSuggestions = jest.fn().mockResolvedValue(impactOptions);

    const { methodsRef } = renderWithResearchOutputForm(
      <ResearchOutputFormSharingCard
        {...defaultProps}
        showImpactAndCategory={true}
        getImpactSuggestions={getImpactSuggestions}
      />,
    );

    await waitFor(() => {
      expect(getImpactSuggestions).toHaveBeenCalled();
    });

    const impactField = screen.getByLabelText(/impact\(required\)/i);
    await userEvent.click(impactField);

    await waitFor(() => {
      expect(screen.getByText(/low impact/i)).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText('Low Impact'));

    expect(methodsRef.current?.getValues('impact')).toEqual(
      expect.objectContaining({ label: 'Low Impact', value: 'low' }),
    );
  });

  it('shows validation message when impact is not selected', async () => {
    const getImpactSuggestions = jest.fn().mockResolvedValue([
      { label: 'High Impact', value: 'high' },
      { label: 'Low Impact', value: 'low' },
    ]);

    renderWithResearchOutputForm(
      <ResearchOutputFormSharingCard
        {...defaultProps}
        showImpactAndCategory={true}
        getImpactSuggestions={getImpactSuggestions}
      />,
      { defaultValues: { impact: undefined } },
    );

    await userEvent.click(screen.getByLabelText(/impact\(required\)/i));
    await userEvent.tab();

    expect(
      await screen.findByText('Please add at least one impact.'),
    ).toBeVisible();
  });

  it('does not show impact validation message when impact is selected', async () => {
    const getImpactSuggestions = jest.fn().mockResolvedValue([
      { label: 'High Impact', value: 'high' },
      { label: 'Low Impact', value: 'low' },
    ]);

    renderWithResearchOutputForm(
      <ResearchOutputFormSharingCard
        {...defaultProps}
        showImpactAndCategory={true}
        getImpactSuggestions={getImpactSuggestions}
      />,
      {
        defaultValues: {
          impact: { label: 'High Impact', value: 'high' },
        },
      },
    );

    await userEvent.click(screen.getByLabelText(/impact\(required\)/i));
    await userEvent.tab();

    await waitFor(() => {
      expect(
        screen.queryByText('Please add at least one impact.'),
      ).not.toBeInTheDocument();
    });
  });

  it('shows validation message when lay impact statement exceeds 100 characters', async () => {
    renderWithResearchOutputForm(
      <ResearchOutputFormSharingCard
        {...defaultProps}
        showImpactAndCategory={true}
      />,
    );

    const longText = 'a'.repeat(101);
    const layImpactInput = screen.getByRole('textbox', {
      name: /lay impact statement/i,
    });
    fireEvent.change(layImpactInput, { target: { value: longText } });
    fireEvent.blur(layImpactInput);

    expect(
      await screen.findByText(
        'The lay impact statement exceeds the character limit. Please limit it to 100 characters.',
      ),
    ).toBeInTheDocument();
  });

  it('shows validation message when lay impact statement is only whitespace', async () => {
    renderWithResearchOutputForm(
      <ResearchOutputFormSharingCard
        {...defaultProps}
        showImpactAndCategory={true}
      />,
    );

    const layImpactInput = screen.getByRole('textbox', {
      name: /lay impact statement/i,
    });
    fireEvent.change(layImpactInput, { target: { value: '   ' } });
    fireEvent.blur(layImpactInput);

    expect(
      await screen.findByText('Please enter a lay impact statement'),
    ).toBeInTheDocument();
  });

  it('clears validation message when lay impact statement is valid', async () => {
    renderWithResearchOutputForm(
      <ResearchOutputFormSharingCard
        {...defaultProps}
        showImpactAndCategory={true}
      />,
    );

    const layImpactInput = screen.getByRole('textbox', {
      name: /lay impact statement/i,
    });
    fireEvent.change(layImpactInput, { target: { value: '   ' } });
    fireEvent.blur(layImpactInput);
    expect(
      await screen.findByText('Please enter a lay impact statement'),
    ).toBeInTheDocument();

    fireEvent.change(layImpactInput, {
      target: { value: 'Helps patients understand the work' },
    });
    fireEvent.blur(layImpactInput);

    await waitFor(() =>
      expect(
        screen.queryByText('Please enter a lay impact statement'),
      ).not.toBeInTheDocument(),
    );
  });
});
