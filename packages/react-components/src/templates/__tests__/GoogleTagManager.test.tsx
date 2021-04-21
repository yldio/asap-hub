import React from 'react';
import { render } from '@testing-library/react';

import GoogleTagManager from '../GoogleTagManager';

jest.mock(
  'https://www.googletagmanager.com/gtm.js?id=containerId',
  () => {
    globalThis.window.dataLayer?.push({ key: 'val' });
    return {};
  },
  { virtual: true },
);

afterEach(() => {
  jest.resetModules();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (globalThis.window as any).dataLayer;
});

it('initializes the data layer', () => {
  render(<GoogleTagManager containerId="containerId" />);
  expect(globalThis.window).toHaveProperty('dataLayer');
});

it('creates a gtm.js event', () => {
  render(<GoogleTagManager containerId="containerId" />);
  expect(globalThis.window.dataLayer).toContainEqual(
    expect.objectContaining({ event: 'gtm.js' }),
  );
});

it('loads the GTM script', () => {
  render(<GoogleTagManager containerId="containerId" />);
  expect(globalThis.window.dataLayer).toContainEqual({ key: 'val' });
});

it('does not re-init if GTM is already loaded', () => {
  render(<GoogleTagManager containerId="containerId" />);
  const oldDataLayer = [...(globalThis.window.dataLayer ?? [])];

  jest.resetModules();
  render(<GoogleTagManager containerId="containerId" />);
  expect(globalThis.window.dataLayer).toStrictEqual(oldDataLayer);
});
