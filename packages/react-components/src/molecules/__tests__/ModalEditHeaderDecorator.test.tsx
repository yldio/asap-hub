import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StaticRouter } from 'react-router-dom/server';

import ModalEditHeaderDecorator from '../ModalEditHeaderDecorator';

const renderDecorator = (
  props: React.ComponentProps<typeof ModalEditHeaderDecorator>,
) =>
  render(
    <StaticRouter location="/">
      <ModalEditHeaderDecorator {...props} />
    </StaticRouter>,
  );

describe('close button', () => {
  it('renders the close button with correct href', () => {
    renderDecorator({ backHref: '/back' });
    const closeButton = screen.getByRole('link');
    expect(closeButton).toHaveAttribute('href', '/back');
  });

  it('renders close button with cross icon', () => {
    renderDecorator({ backHref: '/back' });
    const closeButton = screen.getByRole('link');
    expect(closeButton).toContainHTML('svg');
  });

  it('renders the close button when onSave is not provided', () => {
    renderDecorator({ backHref: '/back' });
    expect(screen.getByRole('link')).toBeInTheDocument();
  });

  it('renders the close button when onSave is provided', () => {
    renderDecorator({ backHref: '/back', onSave: jest.fn() });
    expect(screen.getByRole('link')).toBeInTheDocument();
  });
});

describe('save button', () => {
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

  it('calls onSave multiple times when clicked multiple times', () => {
    const handleSave = jest.fn();
    renderDecorator({ backHref: '/back', onSave: handleSave });

    const saveButton = screen.getByRole('button', { name: 'Save' });
    userEvent.click(saveButton);
    userEvent.click(saveButton);
    userEvent.click(saveButton);

    expect(handleSave).toHaveBeenCalledTimes(3);
  });
});

describe('save button state', () => {
  it('enables the save button by default', () => {
    const handleSave = jest.fn();
    renderDecorator({ backHref: '/back', onSave: handleSave });

    const saveButton = screen.getByRole('button', { name: 'Save' });
    expect(saveButton).toBeEnabled();
  });

  it('enables the save button when saveEnabled is true', () => {
    const handleSave = jest.fn();
    renderDecorator({
      backHref: '/back',
      onSave: handleSave,
      saveEnabled: true,
    });

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
});

describe('layout', () => {
  it('renders both save and close buttons when onSave is provided', () => {
    const handleSave = jest.fn();
    renderDecorator({ backHref: '/back', onSave: handleSave });

    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    expect(screen.getByRole('link')).toBeInTheDocument();
  });

  it('renders save button before close button', () => {
    const handleSave = jest.fn();
    const { container } = renderDecorator({
      backHref: '/back',
      onSave: handleSave,
    });

    const buttons = container.querySelectorAll('button, a');
    expect(buttons[0]).toHaveTextContent('Save');
    expect(buttons[1]).toHaveAttribute('href', '/back');
  });

  it('renders only close button when onSave is not provided', () => {
    renderDecorator({ backHref: '/back' });

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getByRole('link')).toBeInTheDocument();
  });
});
