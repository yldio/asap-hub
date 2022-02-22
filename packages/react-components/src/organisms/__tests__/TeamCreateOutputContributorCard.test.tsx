import { waitFor } from '@testing-library/dom';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import TeamCreateOutputContributorsCard from '../TeamCreateOutputContributorsCard';

const props: ComponentProps<typeof TeamCreateOutputContributorsCard> = {
  loadOptions: jest.fn(),
  onChange: jest.fn(),
  values: [],
  isSaving: false,
};

describe('TeamCreateOutputContributorsCard', () => {
  describe('Labs', () => {
    it('should render lab placeholder when no value is selected', () => {
      const { getByText } = render(
        <TeamCreateOutputContributorsCard {...props} />,
      );
      expect(getByText(/start typing/i)).toBeVisible();
    });
    it('should render provided values', () => {
      const { getByText } = render(
        <TeamCreateOutputContributorsCard
          {...props}
          values={[
            { label: 'One Lab', value: '1' },
            { label: 'Two Lab', value: '2' },
          ]}
        />,
      );
      expect(getByText(/one lab/i)).toBeVisible();
      expect(getByText(/two lab/i)).toBeVisible();
    });
    it('should be able to select from the list of options', async () => {
      const loadOptions = jest.fn();
      loadOptions.mockReturnValue(
        new Promise((resolve) =>
          resolve([
            { label: 'One Lab', value: '1' },
            { label: 'Two Lab', value: '2' },
          ]),
        ),
      );

      const { getByText, getByLabelText, queryByText } = render(
        <TeamCreateOutputContributorsCard
          {...props}
          loadOptions={loadOptions}
        />,
      );
      userEvent.click(getByLabelText(/Labs/i));
      await waitFor(() =>
        expect(queryByText(/loading/i)).not.toBeInTheDocument(),
      );
      userEvent.click(getByText('One Lab'));
      expect(props.onChange).toHaveBeenCalledWith([
        { label: 'One Lab', value: '1' },
      ]);
    });
  });
});
