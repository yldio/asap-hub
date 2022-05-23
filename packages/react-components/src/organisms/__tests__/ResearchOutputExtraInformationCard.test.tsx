import {
  researchTagEnvironmentResponse,
  researchTagMethodResponse,
  researchTagOrganismResponse,
} from '@asap-hub/fixtures';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import ResearchOutputExtraInformationCard from '../ResearchOutputExtraInformationCard';

const getProps = (): ComponentProps<
  typeof ResearchOutputExtraInformationCard
> => ({
  isSaving: false,
  tagSuggestions: [],
  tags: [],
  methods: [],
  organisms: [],
  environments: [],
  documentType: 'Article',
  identifierRequired: false,
  type: 'Protein Data',
  researchTags: [],
});

it('should render a tag', async () => {
  render(
    <ResearchOutputExtraInformationCard {...getProps()} tags={['example']} />,
  );
  expect(screen.getByText(/example/i)).toBeVisible();
});

it('should trigger an onChange event when a tag is selected', async () => {
  const mockOnChange = jest.fn();
  render(
    <ResearchOutputExtraInformationCard
      {...getProps()}
      tagSuggestions={[{ label: 'Example', value: 'Example' }]}
      onChangeTags={mockOnChange}
    />,
  );
  userEvent.click(screen.getByLabelText(/keyword/i));
  userEvent.click(screen.getByText('Example'));
  expect(mockOnChange).toHaveBeenCalledWith(['Example']);
});

it('should trigger an onChange event when a text is being typed into access instructions', async () => {
  const mockOnChange = jest.fn();
  render(
    <ResearchOutputExtraInformationCard
      {...getProps()}
      accessInstructions="access-instructions-value"
      onChangeAccessInstructions={mockOnChange}
    />,
  );

  expect(screen.getByText('access-instructions-value')).toBeVisible();

  const input = screen.getByRole('textbox', { name: /access instructions/i });
  userEvent.type(input, 't');
  expect(mockOnChange).toHaveBeenLastCalledWith('access-instructions-valuet');
});

it('should show lab catalogue number for lab resources', async () => {
  const { rerender } = render(
    <ResearchOutputExtraInformationCard
      {...getProps()}
      documentType={'Article'}
    />,
  );
  expect(screen.queryByLabelText(/Catalog Number/i)).toBeNull();

  rerender(
    <ResearchOutputExtraInformationCard
      {...getProps()}
      documentType={'Lab Resource'}
    />,
  );
  expect(screen.queryByLabelText(/Catalog Number/i)).toBeVisible();
});

it('should hide methods when there is no suggestions', async () => {
  render(<ResearchOutputExtraInformationCard {...getProps()} />);
  expect(screen.queryByLabelText(/Methods/i)).toBeNull();
});

it('should trigger an onChange event when a method is selected', async () => {
  const mockOnChange = jest.fn();
  render(
    <ResearchOutputExtraInformationCard
      {...getProps()}
      researchTags={[researchTagMethodResponse]}
      onChangeMethods={mockOnChange}
    />,
  );

  expect(await screen.findByLabelText(/method/i)).toBeVisible();

  userEvent.click(screen.getByLabelText(/method/i));
  userEvent.click(screen.getByText('ELISA'));
  expect(mockOnChange).toHaveBeenCalledWith(['ELISA']);
});

it('should hide organisms when there is no suggestions', async () => {
  render(<ResearchOutputExtraInformationCard {...getProps()} />);
  expect(screen.queryByLabelText(/Organisms/i)).toBeNull();
});

it('should trigger an onChange event when an organism is selected', async () => {
  const mockOnChange = jest.fn();
  render(
    <ResearchOutputExtraInformationCard
      {...getProps()}
      researchTags={[researchTagOrganismResponse]}
      onChangeOrganisms={mockOnChange}
    />,
  );

  expect(await screen.findByLabelText(/organisms/i)).toBeVisible();

  userEvent.click(screen.getByLabelText(/organisms/i));
  userEvent.click(screen.getByText('Rat'));
  expect(mockOnChange).toHaveBeenCalledWith(['Rat']);
});

it('should hide environments when there is no suggestions', async () => {
  render(<ResearchOutputExtraInformationCard {...getProps()} />);
  expect(screen.queryByLabelText(/environments/i)).toBeNull();
});

it('should trigger an onChange event when an environment is selected', async () => {
  const mockOnChange = jest.fn();
  render(
    <ResearchOutputExtraInformationCard
      {...getProps()}
      researchTags={[researchTagEnvironmentResponse]}
      onChangeEnvironments={mockOnChange}
    />,
  );

  expect(await screen.findByLabelText(/environments/i)).toBeVisible();

  userEvent.click(screen.getByLabelText(/environments/i));
  userEvent.click(screen.getByText('In Vitro'));
  expect(mockOnChange).toHaveBeenCalledWith(['In Vitro']);
});
