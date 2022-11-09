import { findParentWithStyle } from '@asap-hub/dom-test-utils';
import { render } from '@testing-library/react';

import Pill from '../Pill';

it('renders a tag label with content', () => {
  const { container } = render(<Pill>Text</Pill>);
  expect(container.textContent).toEqual('Text');
});

it.each`
  accent       | border                  | background              | text
  ${'default'} | ${'rgb(223, 229, 234)'} | ${'rgb(255, 255, 255)'} | ${'rgb(77, 100, 107)'}
  ${'green'}   | ${'rgb(40, 121, 83)'}   | ${'rgb(228, 245, 238)'} | ${'rgb(40, 121, 83)'}
  ${'warning'} | ${'rgb(206, 128, 26)'}  | ${'rgb(248, 237, 222)'} | ${'rgb(206, 128, 26)'}
  ${'info'}    | ${'rgb(12, 141, 195)'}  | ${'rgb(230, 243, 249)'} | ${'rgb(12, 141, 195)'}
  ${'neutral'} | ${'rgb(146, 153, 158)'} | ${'rgb(237, 241, 243)'} | ${'rgb(146, 153, 158)'}
`(
  'sets text color border and background color for $accent',
  ({ accent, border, text, background }) => {
    const { getByText } = render(<Pill accent={accent}>Text</Pill>);

    expect([
      findParentWithStyle(getByText('Text')!, 'borderColor')!.borderColor,
      findParentWithStyle(getByText('Text')!, 'backgroundColor')!
        .backgroundColor,
      findParentWithStyle(getByText('Text')!, 'color')!.color,
    ]).toEqual([border, background, text]);
  },
);
