import { ComponentProps } from 'react';
import { createEventResponse } from '@asap-hub/fixtures';
import { EventResponse } from '@asap-hub/model';
import { render } from '@testing-library/react';
import { subDays } from 'date-fns';

import EventMaterials from '../EventMaterials';

type EventMaterialsProps = ComponentProps<typeof EventMaterials>;
const props: EventMaterialsProps = {
  ...createEventResponse(),
  endDate: subDays(new Date(), 100).toISOString(),
};
const meetingMaterials: EventResponse['meetingMaterials'] = [
  {
    title: 'My additional material',
    url: 'https://example.com/material',
  },
];

it('renders nothing until an event is over', () => {
  const { container } = render(
    <EventMaterials {...props} endDate={new Date().toISOString()} />,
  );
  expect(container).toBeEmptyDOMElement();
});

describe.each`
  type                  | typeText               | presentValue            | presentExpectedText           | missingValue
  ${'notes'}            | ${'Notes'}             | ${'My Notes'}           | ${'My Notes'}                 | ${undefined}
  ${'presentation'}     | ${'Presentation'}      | ${'My Presentation'}    | ${'My Presentation'}          | ${undefined}
  ${'videoRecording'}   | ${'Video recording'}   | ${'My Video recording'} | ${'My Video recording'}       | ${undefined}
  ${'meetingMaterials'} | ${'Meeting materials'} | ${meetingMaterials}     | ${meetingMaterials[0]!.title} | ${[]}
`(
  'material of type $type',
  <T extends keyof EventMaterialsProps>({
    type,
    typeText,
    presentValue,
    presentExpectedText,
    missingValue,
  }: {
    type: T;
    typeText: string;
    presentValue: EventMaterialsProps[T];
    presentExpectedText: string;
    missingValue: EventMaterialsProps[T];
  }) => {
    it('is rendered when present', () => {
      const { getByText } = render(
        <EventMaterials {...props} {...{ [type]: presentValue }} />,
      );
      expect(getByText(presentExpectedText)).toBeInTheDocument();
    });

    it('is rendered as coming soon when missing', () => {
      const { getByText } = render(
        <EventMaterials {...props} {...{ [type]: missingValue }} />,
      );
      expect(
        getByText(new RegExp(`${typeText}.+coming soon`, 'i')),
      ).toBeInTheDocument();
    });

    it('is rendered as unavailable when null', () => {
      const { getByText } = render(
        <EventMaterials {...props} {...{ [type]: null }} />,
      );
      expect(
        getByText(new RegExp(`(^|\\W)no.+${typeText}`, 'i')),
      ).toBeInTheDocument();
    });
  },
);

it('renders a special placeholder when all materials unavailable', () => {
  const { getByText } = render(
    <EventMaterials
      {...props}
      notes={null}
      presentation={null}
      videoRecording={null}
      meetingMaterials={null}
    />,
  );
  expect(getByText(/no .* material/i)).toBeVisible();
});
