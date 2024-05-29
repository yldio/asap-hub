import { render, screen } from '@testing-library/react';

import CaptionItem from '../CaptionItem';

it('renders label, values and icons', () => {
  render(
    <CaptionItem
      label="ASAP Output"
      belowAverageMin={0}
      belowAverageMax={1}
      averageMin={2}
      averageMax={4}
      aboveAverageMin={5}
      aboveAverageMax={10}
    />,
  );
  expect(screen.getByText('ASAP Output:')).toBeVisible();
  expect(screen.getByText('0 - 1')).toBeVisible();
  expect(screen.getByTitle('Below Average')).toBeInTheDocument();
  expect(screen.getByText('2 - 4')).toBeVisible();
  expect(screen.getByTitle('Average')).toBeInTheDocument();
  expect(screen.getByText('5 - 10')).toBeVisible();
  expect(screen.getByTitle('Above Average')).toBeInTheDocument();
});

it('renders below average without numbers when belowAverageMax is negative', () => {
  render(
    <CaptionItem
      label="ASAP Public Output"
      belowAverageMin={0}
      belowAverageMax={-1}
      averageMin={0}
      averageMax={2}
      aboveAverageMin={4}
      aboveAverageMax={6}
    />,
  );
  expect(screen.getByText('ASAP Public Output:')).toBeVisible();
  expect(screen.getByText('- - -')).toBeVisible();
  expect(screen.getByTitle('Below Average')).toBeInTheDocument();
  expect(screen.getByText('0 - 2')).toBeVisible();
  expect(screen.getByTitle('Average')).toBeInTheDocument();
  expect(screen.getByText('4 - 6')).toBeVisible();
  expect(screen.getByTitle('Above Average')).toBeInTheDocument();
});

it('renders average min as zero when it is negative', () => {
  render(
    <CaptionItem
      label="ASAP Public Output"
      belowAverageMin={-3}
      belowAverageMax={-2}
      averageMin={-1}
      averageMax={2}
      aboveAverageMin={4}
      aboveAverageMax={6}
    />,
  );
  expect(screen.getByText('ASAP Public Output:')).toBeVisible();
  expect(screen.getByText('- - -')).toBeVisible();
  expect(screen.getByTitle('Below Average')).toBeInTheDocument();
  expect(screen.getByText('0 - 2')).toBeVisible();
  expect(screen.getByTitle('Average')).toBeInTheDocument();
  expect(screen.getByText('4 - 6')).toBeVisible();
  expect(screen.getByTitle('Above Average')).toBeInTheDocument();
});
