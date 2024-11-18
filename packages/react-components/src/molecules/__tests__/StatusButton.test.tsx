import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  info100,
  info500,
  success100,
  success500,
  warning100,
  warning500,
} from '../../colors';

import StatusButton, {
  iconStyles,
  statusButtonStyles,
  statusIcon,
  statusTagStyles,
  StatusType,
} from '../StatusButton';

it('renders a StatusButton as Label when canEdit is false', () => {
  render(<StatusButton buttonChildren={() => <>Status</>} />);
  expect(screen.getByRole('button').textContent).toContain('Status');
  expect(screen.getByRole('button')).toBeDisabled();
});

it('renders a StatusButton as dropdown when canEdit is true', () => {
  render(<StatusButton buttonChildren={() => <>Status</>} canEdit={true} />);
  expect(screen.getByRole('button').textContent).toContain('Status');
  expect(screen.getByRole('button')).toBeEnabled();
});

it('renders a StatusButton button item', () => {
  const onClick = jest.fn();
  render(
    <StatusButton buttonChildren={() => <>Example</>}>
      {{ item: 'Example Button', onClick }}
      {{ item: 'Second Item', onClick: jest.fn() }}
    </StatusButton>,
  );
  userEvent.click(screen.getByRole('button'));
  userEvent.click(screen.getByText('Example Button'));

  expect(onClick).toHaveBeenCalled();
});

it('renders a modal on click', () => {
  render(
    <StatusButton buttonChildren={() => <>test</>} canEdit={true}>
      {{ item: '1', onClick: jest.fn() }}
      {{ item: '2', onClick: jest.fn() }}
      {{ item: '3', onClick: jest.fn() }}
    </StatusButton>,
  );
  userEvent.click(screen.getByRole('button'));

  expect(screen.getAllByRole('listitem').map((li) => li.textContent)).toEqual([
    '1',
    '2',
    '3',
  ]);
});

it('renders items on modal and hides it on outside click', () => {
  jest.spyOn(console, 'error').mockImplementation();
  render(
    <>
      <h1>Element</h1>
      <StatusButton buttonChildren={() => <>test</>} canEdit={true}>
        {{ item: '1', onClick: jest.fn() }}
        {{ item: '2', onClick: jest.fn(), type: 'warning' }}
        {{ item: '3', onClick: jest.fn(), type: 'final' }}
      </StatusButton>
    </>,
  );

  userEvent.click(screen.getByRole('button'));
  screen.getAllByRole('listitem').forEach((e) => expect(e).toBeVisible());
  userEvent.click(screen.getByRole('heading'));
  screen.queryAllByRole('listitem').forEach((e) => expect(e).not.toBeVisible());
});

describe('statusButtonStyles', () => {
  it.each([
    ['warning', true, warning100.rgba, warning500.rgba],
    ['final', true, success100.rgba, success500.rgba],
    ['default', true, info100.rgba, info500.rgba],
    ['none', true, info100.rgba, info500.rgba],
  ] as [StatusType, boolean, string, string][])(
    'applies correct styles for type %s and isComplianceReviewer %s',
    (type, isComplianceReviewer, expectedBackgroundColor, expectedColor) => {
      const { container } = render(
        <div css={statusButtonStyles(type, isComplianceReviewer)} />,
      );
      expect(container.firstChild).toHaveStyle(
        `backgroundColor: ${expectedBackgroundColor}`,
      );
      expect(container.firstChild).toHaveStyle(`color: ${expectedColor}`);
    },
  );
});

describe('statusTagStyles', () => {
  it.each([
    ['warning', info100.rgba, info500.rgba],
    ['final', success100.rgba, success500.rgba],
    ['default', warning100.rgba, warning500.rgba],
    ['none', info100.rgba, info500.rgba],
  ] as [StatusType, string, string][])(
    'applies correct styles for type %s',
    (type, expectedBackgroundColor, expectedColor) => {
      const { container } = render(<div css={statusTagStyles(type)}>Test</div>);

      expect(container.firstChild).toHaveStyle(
        `backgroundColor: ${expectedBackgroundColor}`,
      );
      expect(container.firstChild).toHaveStyle(`color: ${expectedColor}`);
    },
  );
});

describe('iconStyles', () => {
  it.each([
    ['warning', true, warning500.rgba],
    ['final', true, success500.rgba],
    ['final', false, success500.rgba],
    ['default', false, warning500.rgba],
  ] as [StatusType, boolean, string | null][])(
    'applies correct styles for icon with type %s and isComplianceReviewer %s',
    (type, isComplianceReviewer, iconExpectedColor) => {
      const { container } = render(
        <span css={iconStyles(type, isComplianceReviewer)}>
          {statusIcon(type, isComplianceReviewer)}
        </span>,
      );
      const pathElement =
        container.querySelector('svg g path') ??
        container.querySelector('svg rect');

      expect(pathElement).toBeInTheDocument();
      expect(pathElement).toHaveStyle(`fill: ${iconExpectedColor}`);
    },
  );

  it.each([
    ['default', true, null],
    ['none', true, null],
    ['warning', false, null],
    ['none', false, null],
  ] as [StatusType, boolean, string | null][])(
    'applies correct styles for icon with type %s and isComplianceReviewer %s (where icon should not show)',
    (type, isComplianceReviewer) => {
      const { container } = render(
        <span css={iconStyles(type, isComplianceReviewer)}>
          {statusIcon(type, isComplianceReviewer)}
        </span>,
      );
      const svgElement = container.querySelector('svg');
      expect(svgElement).not.toBeInTheDocument();
    },
  );
});
