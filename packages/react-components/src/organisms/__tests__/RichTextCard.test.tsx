import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import RichTextCard from '../RichTextCard';
import userEvent from '@testing-library/user-event';

const props: ComponentProps<typeof RichTextCard> = {
  title: '',
  text: 'Example',
};
it('renders a heading at level 2', () => {
  const { getByRole } = render(
    <RichTextCard {...props} title="Meeting materials" />,
  );
  expect(getByRole('heading').tagName).toBe('H2');
  expect(getByRole('heading').textContent).toEqual('Meeting materials');
});
it('does not render a heading if there is undefined text', () => {
  const { queryByRole } = render(<RichTextCard {...props} text={undefined} />);
  expect(queryByRole('heading')).not.toBeInTheDocument();
});
it('does not render a heading if there is null text', () => {
  const { queryByRole } = render(<RichTextCard {...props} text={null} />);
  expect(queryByRole('heading')).not.toBeInTheDocument();
});

it('renders the rich text notes', () => {
  const { getByText } = render(
    <RichTextCard
      {...props}
      text={`<a href="https://google.com">Google</a>`}
    />,
  );
  expect(getByText('Google').tagName).toBe('A');
});

it('is collapsible when prop set', () => {
  const { getByText, queryByText } = render(
    <RichTextCard {...props} collapsible>
      text
    </RichTextCard>,
  );
  expect(queryByText('text')).toEqual(null);

  userEvent.click(getByText(/show/i));
  expect(getByText('text')).toBeVisible();
});
