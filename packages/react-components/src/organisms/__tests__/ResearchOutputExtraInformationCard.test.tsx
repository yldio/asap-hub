import {
  researchTagEnvironmentResponse,
  researchTagMethodResponse,
  researchTagOrganismResponse,
} from '@asap-hub/fixtures';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import ResearchOutputExtraInformationCard from '../ResearchOutputExtraInformationCard';

const props: ComponentProps<typeof ResearchOutputExtraInformationCard> = {
  isSaving: false,
  tagSuggestions: [],
  tags: [],
  methods: [],
  organisms: [],
  environments: [],
  documentType: 'Article',
  researchTags: [],
  showExtraInformationFields: true,
  showCatalogNumber: false,
};

it('should render a tag', async () => {
  render(<ResearchOutputExtraInformationCard {...props} tags={['example']} />);
  expect(screen.getByText(/example/i)).toBeVisible();
});

it('should trigger an onChange event when a tag is selected', async () => {
  const mockOnChange = jest.fn();
  render(
    <ResearchOutputExtraInformationCard
      {...props}
      tagSuggestions={[{ label: 'Example', value: 'Example' }]}
      onChangeTags={mockOnChange}
    />,
  );
  await userEvent.click(screen.getByLabelText(/keyword/i));
  await userEvent.click(screen.getByText('Example'));
  expect(mockOnChange).toHaveBeenCalledWith(['Example']);
});

it('should trigger an onChange event when a text is being typed into access instructions', async () => {
  const mockOnChange = jest.fn();
  render(
    <ResearchOutputExtraInformationCard
      {...props}
      usageNotes="access-instructions-value"
      onChangeUsageNotes={mockOnChange}
      showExtraInformationFields
    />,
  );

  expect(screen.getByText('access-instructions-value')).toBeVisible();

  const input = screen.getByRole('textbox', { name: /usage notes/i });
  await userEvent.type(input, 't');
  expect(mockOnChange).toHaveBeenLastCalledWith('access-instructions-valuet');
});

it('should show lab catalogue number when showCatalogNumber is true', async () => {
  const { rerender } = render(
    <ResearchOutputExtraInformationCard {...props} showCatalogNumber={false} />,
  );
  expect(screen.queryByLabelText(/Catalog Number/i)).toBeNull();

  rerender(
    <ResearchOutputExtraInformationCard
      {...props}
      documentType={'Lab Material'}
      showCatalogNumber
    />,
  );
  expect(screen.queryByLabelText(/Catalog Number/i)).toBeVisible();
});

it('should show the identifier section when showExtraInformationFields is true', async () => {
  const { rerender } = render(
    <ResearchOutputExtraInformationCard
      {...props}
      showExtraInformationFields={false}
    />,
  );
  expect(
    screen.queryByRole('combobox', { name: /Identifier Type/i }),
  ).toBeNull();

  expect(screen.queryByRole('textbox', { name: /usage notes/i })).toBeNull();

  rerender(
    <ResearchOutputExtraInformationCard
      {...props}
      showExtraInformationFields
    />,
  );
  expect(
    screen.getByRole('combobox', { name: /Identifier Type/i }),
  ).toBeVisible();
  expect(screen.getByRole('textbox', { name: /usage notes/i })).toBeVisible();
});

it('should hide methods when there is no suggestions', async () => {
  render(<ResearchOutputExtraInformationCard {...props} methods={[]} />);
  expect(screen.queryByLabelText(/Methods/i)).toBeNull();
});

it('should trigger an onChange event when a method is selected', async () => {
  const mockOnChange = jest.fn();
  render(
    <ResearchOutputExtraInformationCard
      {...props}
      researchTags={[researchTagMethodResponse]}
      onChangeMethods={mockOnChange}
    />,
  );

  expect(await screen.findByLabelText(/method/i)).toBeVisible();

  await userEvent.click(screen.getByLabelText(/method/i));
  await userEvent.click(screen.getByText('ELISA'));
  expect(mockOnChange).toHaveBeenCalledWith(['ELISA']);
});

it('should hide organisms when there is no suggestions', async () => {
  render(<ResearchOutputExtraInformationCard {...props} organisms={[]} />);
  expect(screen.queryByLabelText(/Organisms/i)).toBeNull();
});

it('should trigger an onChange event when an organism is selected', async () => {
  const mockOnChange = jest.fn();
  render(
    <ResearchOutputExtraInformationCard
      {...props}
      researchTags={[researchTagOrganismResponse]}
      onChangeOrganisms={mockOnChange}
    />,
  );

  expect(await screen.findByLabelText(/organisms/i)).toBeVisible();

  await userEvent.click(screen.getByLabelText(/organisms/i));
  await userEvent.click(screen.getByText('Rat'));
  expect(mockOnChange).toHaveBeenCalledWith(['Rat']);
});

it('should hide environments when there is no suggestions', async () => {
  render(<ResearchOutputExtraInformationCard {...props} environments={[]} />);
  expect(screen.queryByLabelText(/environments/i)).toBeNull();
});

it('should trigger an onChange event when an environment is selected', async () => {
  const mockOnChange = jest.fn();
  render(
    <ResearchOutputExtraInformationCard
      {...props}
      researchTags={[researchTagEnvironmentResponse]}
      onChangeEnvironments={mockOnChange}
    />,
  );

  expect(await screen.findByLabelText(/environments/i)).toBeVisible();

  await userEvent.click(screen.getByLabelText(/environments/i));
  await userEvent.click(screen.getByText('In Vitro'));
  expect(mockOnChange).toHaveBeenCalledWith(['In Vitro']);
});
