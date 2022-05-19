import {
  researchTagMethodResponse,
  researchTagOrganismResponse,
} from '@asap-hub/fixtures';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import TeamCreateOutputExtraInformationCard from '../TeamCreateOutputExtraInformationCard';

const getProps = (): ComponentProps<
  typeof TeamCreateOutputExtraInformationCard
> => ({
  isSaving: false,
  tagSuggestions: [],
  tags: [],
  methods: [],
  organisms: [],
  documentType: 'Article',
  identifierRequired: false,
  type: 'Protein Data',
  researchTags: [],
});

it('should render a tag', async () => {
  render(
    <TeamCreateOutputExtraInformationCard {...getProps()} tags={['example']} />,
  );
  expect(screen.getByText(/example/i)).toBeVisible();
});

it('should trigger an onChange event when a tag is selected', async () => {
  const mockOnChange = jest.fn();
  render(
    <TeamCreateOutputExtraInformationCard
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
    <TeamCreateOutputExtraInformationCard
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
    <TeamCreateOutputExtraInformationCard
      {...getProps()}
      documentType={'Article'}
    />,
  );
  expect(screen.queryByLabelText(/Catalog Number/i)).toBeNull();

  rerender(
    <TeamCreateOutputExtraInformationCard
      {...getProps()}
      documentType={'Lab Resource'}
    />,
  );
  expect(screen.queryByLabelText(/Catalog Number/i)).toBeVisible();
});

it('should hide methods when there is no suggestions', async () => {
  render(<TeamCreateOutputExtraInformationCard {...getProps()} />);
  expect(screen.queryByLabelText(/Methods/i)).toBeNull();
});

it('should trigger an onChange event when a method is selected', async () => {
  const mockOnChange = jest.fn();
  render(
    <TeamCreateOutputExtraInformationCard
      {...getProps()}
      researchTags={[researchTagMethodResponse]}
      onChangeMethods={mockOnChange}
    />,
  );

  expect(await screen.findByLabelText(/method/i)).toBeVisible();

  userEvent.click(screen.getByLabelText(/method/i));
  userEvent.click(screen.getByText('Activity Assay'));
  expect(mockOnChange).toHaveBeenCalledWith(['Activity Assay']);
});

it('should hide organisms when there is no suggestions', async () => {
  render(<TeamCreateOutputExtraInformationCard {...getProps()} />);
  expect(screen.queryByLabelText(/Organisms/i)).toBeNull();
});

it('should trigger an onChange event when an organism is selected', async () => {
  const mockOnChange = jest.fn();
  render(
    <TeamCreateOutputExtraInformationCard
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
