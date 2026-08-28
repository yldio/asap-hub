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

// with no attribute the prefers-color-scheme rules own the palette, so System
// keeps following the OS long after the menu that set it has closed
it('leaves the theme attribute off in system mode', async () => {
  window.localStorage.setItem(themeStorageKey, 'dark');
  renderApp(<Header />, { me: memberMe });
  await openMenu();

  document.documentElement.dataset.theme = 'dark';

  await userEvent.click(screen.getByRole('button', { name: /change theme/i }));

  expect(
    screen.getByRole('button', { name: /change theme/i }),
  ).toHaveTextContent('System');
  expect(document.documentElement.dataset.theme).toBeUndefined();
});

it('starts from the persisted theme', async () => {
  window.localStorage.setItem(themeStorageKey, 'dark');
  renderApp(<Header />, { me: memberMe });
  await openMenu();

  expect(
    screen.getByRole('button', { name: /change theme/i }),
  ).toHaveTextContent('Dark');
});
