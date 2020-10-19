import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { format } from 'date-fns';

/* istanbul ignore next */
// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop = () => {};

export const getSvgAspectRatio = (element: React.ReactElement): number => {
  const markup = renderToStaticMarkup(element);

  const container = document.createElement('div');
  container.innerHTML = markup;

  const svg = container.querySelector('svg');
  if (!svg) {
    throw new Error(
      'Failed to calculate SVG aspect ratio. Element does not contain an SVG.',
    );
  }
  const { width, height } = svg.viewBox.baseVal;
  return width / height;
};

export const createMailTo = (
  email: string,
  { subject, body }: { subject?: string; body?: string } = {},
): string => {
  const mailtoParams = new URLSearchParams();
  if (subject) mailtoParams.set('subject', subject);
  if (body) mailtoParams.set('body', body);

  return `mailto:${email.split('@').map(encodeURIComponent).join('@')}${
    mailtoParams.toString() ? `?${mailtoParams.toString()}` : ''
  }`;
};

export const formatDate = (date: Date): string => format(date, 'do MMMM yyyy');

export const isInternalLink = (href: string): boolean =>
  new URL(href ?? '', window.location.href).origin === window.location.origin;
