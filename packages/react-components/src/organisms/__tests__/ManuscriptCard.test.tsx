import { createManuscriptResponse } from '@asap-hub/fixtures';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import ManuscriptCard from '../ManuscriptCard';

const props: ComponentProps<typeof ManuscriptCard> = {
  ...createManuscriptResponse(),
};

it('displays manuscript version card when expanded', () => {
  const { getByText, queryByText, getByRole, rerender } = render(
    <ManuscriptCard {...props} />,
  );

  expect(queryByText(/Original Research/i)).not.toBeInTheDocument();

  expect(queryByText(/Preprint/i)).not.toBeInTheDocument();

  userEvent.click(getByRole('button'));

  rerender(
    <ManuscriptCard
      {...props}
      versions={[
        {
          ...props.versions[0]!,
          type: 'Original Research',
          lifecycle: 'Preprint',
        },
      ]}
    />,
  );

  expect(getByText(/Original Research/i)).toBeVisible();
  expect(getByText(/Preprint/i)).toBeVisible();
});
