import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { memberMe, renderApp } from '../../test-utils';
import { themeStorageKey } from '../../ui/themeMode';
import Header from '../Header';

beforeEach(() => {
  window.localStorage.clear();
  delete document.documentElement.dataset.theme;
});

const openMenu = async () => {
  await userEvent.click(screen.getByRole('button', { name: memberMe.name }));
};

it('cycles the theme through light, dark and system', async () => {
  renderApp(<Header />, { me: memberMe });
  await openMenu();

  const toggle = screen.getByRole('button', { name: /change theme/i });
  expect(toggle).toHaveTextContent('System');

  await userEvent.click(toggle);
  expect(window.localStorage.getItem(themeStorageKey)).toBe('light');
  expect(document.documentElement.dataset.theme).toBe('light');

  await userEvent.click(screen.getByRole('button', { name: /change theme/i }));
  expect(window.localStorage.getItem(themeStorageKey)).toBe('dark');
  expect(document.documentElement.dataset.theme).toBe('dark');

  await userEvent.click(screen.getByRole('button', { name: /change theme/i }));
  expect(window.localStorage.getItem(themeStorageKey)).toBe('system');
});

it('starts from the persisted theme', async () => {
  window.localStorage.setItem(themeStorageKey, 'dark');
  renderApp(<Header />, { me: memberMe });
  await openMenu();

  expect(
    screen.getByRole('button', { name: /change theme/i }),
  ).toHaveTextContent('Dark');
});
