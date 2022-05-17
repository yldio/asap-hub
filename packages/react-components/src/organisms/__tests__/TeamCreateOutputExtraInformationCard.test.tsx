import { researchTagResponse } from '@asap-hub/fixtures';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import TeamCreateOutputExtraInformationCard from '../TeamCreateOutputExtraInformationCard';

const getProps = (): {
  props: ComponentProps<typeof TeamCreateOutputExtraInformationCard>;
  waitForGetResearchTags: () => Promise<void>;
} => {
  const promise = Promise.resolve([]);
  const getResearchTags = jest.fn(() => promise);
  return {
    props: {
      isSaving: false,
      tagSuggestions: [],
      tags: [],
      methods: [],
      documentType: 'Article',
      identifierRequired: false,
      type: 'Protein Data',
      getResearchTags,
    },
    waitForGetResearchTags: async () => {
      await act(async () => {
        await promise;
      });
    },
  };
};

it('should render a tag', async () => {
  const { props, waitForGetResearchTags } = getProps();
  render(
    <TeamCreateOutputExtraInformationCard {...props} tags={['example']} />,
  );
  expect(screen.getByText(/example/i)).toBeVisible();
  await waitForGetResearchTags();
});

it('should trigger an onChange event when a tag is selected', async () => {
  const mockOnChange = jest.fn();
  const { props, waitForGetResearchTags } = getProps();
  render(
    <TeamCreateOutputExtraInformationCard
      {...props}
      tagSuggestions={[{ label: 'Example', value: 'Example' }]}
      onChangeTags={mockOnChange}
    />,
  );
  userEvent.click(screen.getByLabelText(/keyword/i));
  userEvent.click(screen.getByText('Example'));
  expect(mockOnChange).toHaveBeenCalledWith(['Example']);
  await waitForGetResearchTags();
});

it('should trigger an onChange event when a text is being typed into access instructions', async () => {
  const mockOnChange = jest.fn();
  const { props, waitForGetResearchTags } = getProps();
  render(
    <TeamCreateOutputExtraInformationCard
      {...props}
      accessInstructions="access-instructions-value"
      onChangeAccessInstructions={mockOnChange}
    />,
  );

  expect(screen.getByText('access-instructions-value')).toBeVisible();

  const input = screen.getByRole('textbox', { name: /access instructions/i });
  userEvent.type(input, 't');
  expect(mockOnChange).toHaveBeenLastCalledWith('access-instructions-valuet');
  await waitForGetResearchTags();
});

it('should show lab catalogue number for lab resources', async () => {
  const { props, waitForGetResearchTags } = getProps();
  const { rerender } = render(
    <TeamCreateOutputExtraInformationCard
      {...props}
      documentType={'Article'}
    />,
  );
  expect(screen.queryByLabelText(/Catalog Number/i)).toBeNull();
  rerender(
    <TeamCreateOutputExtraInformationCard
      {...props}
      documentType={'Lab Resource'}
    />,
  );
  expect(screen.queryByLabelText(/Catalog Number/i)).toBeVisible();
  await waitForGetResearchTags();
});

it('should hide methods when there is no suggestions', async () => {
  const { props, waitForGetResearchTags } = getProps();
  render(<TeamCreateOutputExtraInformationCard {...props} />);
  expect(screen.queryByLabelText(/Methods/i)).toBeNull();
  await waitForGetResearchTags();
});

it('should trigger an onChange event when a method is selected', async () => {
  const { props } = getProps();
  const mockOnChange = jest.fn();
  render(
    <TeamCreateOutputExtraInformationCard
      {...props}
      getResearchTags={() =>
        Promise.resolve([
          researchTagResponse,
          {
            id: '4321',
            name: 'MRI',
            category: 'Method',
            types: ['Protein Data', 'Assay'],
            entities: ['Research Output'],
          },
        ])
      }
      onChangeMethods={mockOnChange}
    />,
  );

  expect(await screen.findByLabelText(/method/i)).toBeVisible();

  userEvent.click(screen.getByLabelText(/method/i));
  userEvent.click(screen.getByText('Activity Assay'));
  expect(mockOnChange).toHaveBeenCalledWith(['Activity Assay']);
});
