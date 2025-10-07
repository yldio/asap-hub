import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StaticRouter } from 'react-router-dom';

import ModalEditHeaderDecorator from '../ModalEditHeaderDecorator';

const renderDecorator = (
  props: React.ComponentProps<typeof ModalEditHeaderDecorator>,
) =>
  render(
    <StaticRouter>
      <ModalEditHeaderDecorator {...props} />
    </StaticRouter>,
  );

it('renders the close button', () => {
  renderDecorator({ backHref: '/back' });
  const closeButton = screen.getByRole('link');
  expect(closeButton).toHaveAttribute('href', '/back');
});

it('renders the save button when onSave is provided', () => {
  const handleSave = jest.fn();
  renderDecorator({ backHref: '/back', onSave: handleSave });

  const saveButton = screen.getByRole('button', { name: 'Save' });
  expect(saveButton).toBeInTheDocument();
});

it('does not render the save button when onSave is not provided', () => {
  renderDecorator({ backHref: '/back' });

  const saveButton = screen.queryByRole('button', { name: 'Save' });
  expect(saveButton).not.toBeInTheDocument();
});

it('calls onSave when save button is clicked', () => {
  const handleSave = jest.fn();
  renderDecorator({ backHref: '/back', onSave: handleSave });

  const saveButton = screen.getByRole('button', { name: 'Save' });
  userEvent.click(saveButton);

  expect(handleSave).toHaveBeenCalledTimes(1);
});

it('enables the save button by default', () => {
  const handleSave = jest.fn();
  renderDecorator({ backHref: '/back', onSave: handleSave });

  const saveButton = screen.getByRole('button', { name: 'Save' });
  expect(saveButton).toBeEnabled();
});

it('disables the save button when saveEnabled is false', () => {
  const handleSave = jest.fn();
  renderDecorator({
    backHref: '/back',
    onSave: handleSave,
    saveEnabled: false,
  });

  const saveButton = screen.getByRole('button', { name: 'Save' });
  expect(saveButton).toBeDisabled();
});

it('does not call onSave when save button is disabled and clicked', () => {
  const handleSave = jest.fn();
  renderDecorator({
    backHref: '/back',
    onSave: handleSave,
    saveEnabled: false,
  });

  const saveButton = screen.getByRole('button', { name: 'Save' });
  userEvent.click(saveButton);

  expect(handleSave).not.toHaveBeenCalled();
});

it('renders both save and close buttons when onSave is provided', () => {
  const handleSave = jest.fn();
  renderDecorator({ backHref: '/back', onSave: handleSave });

  expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  expect(screen.getByRole('link')).toBeInTheDocument();
});
