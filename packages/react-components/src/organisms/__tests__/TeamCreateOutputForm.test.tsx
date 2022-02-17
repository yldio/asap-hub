import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StaticRouter } from 'react-router-dom';
import { ComponentProps } from 'react';

import TeamCreateOutputForm from '../TeamCreateOutputForm';

const props: ComponentProps<typeof TeamCreateOutputForm> = {
  tagSuggestions: [],
  type: 'Article',
};

const clickShare = () => {
  const button = screen.getByRole('button', { name: /Share/i });
  userEvent.click(button);
};

it('renders the form', async () => {
  const { getByText } = render(
    <StaticRouter>
      <TeamCreateOutputForm {...props} />
    </StaticRouter>,
  );
  expect(getByText(/What are you sharing/i)).toBeVisible();
});

it('does not save when the form is missing data', async () => {
  const saveFn = jest.fn();
  render(
    <StaticRouter>
      <TeamCreateOutputForm {...props} onSave={saveFn} />
    </StaticRouter>,
  );
  clickShare();
  expect(saveFn).not.toHaveBeenCalled();
});
