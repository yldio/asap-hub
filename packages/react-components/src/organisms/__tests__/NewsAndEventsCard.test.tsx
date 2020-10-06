import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';

import NewsAndEventsCard from '../NewsAndEventsCard';

describe('News', () => {
  const newsCardProps: ComponentProps<typeof NewsAndEventsCard> = {
    type: 'News',
    title: 'Not a Title',
    created: new Date(),
  };

  it('renders the title', () => {
    const { getByRole } = render(
      <NewsAndEventsCard {...newsCardProps} title="Title" />,
    );
    expect(getByRole('heading').textContent).toEqual('Title');
    expect(getByRole('heading').tagName).toEqual('H2');
  });

  it('renders subtitle when present', () => {
    const { rerender, queryByText, getByText } = render(
      <NewsAndEventsCard {...newsCardProps} />,
    );
    expect(queryByText(/subtitle/i)).not.toBeInTheDocument();

    rerender(<NewsAndEventsCard {...newsCardProps} subtitle="Subtitle" />);
    expect(getByText(/subtitle/i)).toBeVisible();
  });

  it('renders thumbnail when when present', () => {
    const { rerender, getByRole, queryByRole } = render(
      <NewsAndEventsCard {...newsCardProps} />,
    );
    expect(queryByRole('img')).not.toBeInTheDocument();

    rerender(<NewsAndEventsCard {...newsCardProps} thumbnail="/thumbnail" />);
    expect(getByRole('img')).toBeVisible();
  });
});
