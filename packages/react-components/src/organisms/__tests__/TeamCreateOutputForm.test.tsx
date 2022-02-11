import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StaticRouter } from 'react-router-dom';

import TeamCreateOutputForm from '../TeamCreateOutputForm';

const clickShare = () => {
  const button = screen.getByRole('button', { name: /Share/i });
  userEvent.click(button);
};

it('renders the form', async () => {
  const { getByText } = render(
    <StaticRouter>
      <TeamCreateOutputForm tagSuggestions={[]} />
    </StaticRouter>,
  );
  expect(getByText(/What are you sharing/i)).toBeVisible();
});

it('does not save when the form is missing data', async () => {
  const saveFn = jest.fn();
  render(
    <StaticRouter>
      <TeamCreateOutputForm onSave={saveFn} tagSuggestions={[]} />
    </StaticRouter>,
  );
  clickShare();
  expect(saveFn).not.toHaveBeenCalled();
});
