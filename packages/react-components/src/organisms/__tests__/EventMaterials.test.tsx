import React, { ComponentProps } from 'react';
import { createEventResponse } from '@asap-hub/fixtures';
import { EventResponse } from '@asap-hub/model';
import { render } from '@testing-library/react';

import EventMaterials from '../EventMaterials';

type EventMaterialsProps = ComponentProps<typeof EventMaterials>;
const meetingMaterials: EventResponse['meetingMaterials'] = [
  {
    title: 'My additional material',
    url: 'https://example.com/material',
  },
];

describe.each`
  type                  | typeText               | presentValue            | presentExpectedText          | missingValue
  ${'notes'}            | ${'Notes'}             | ${'My Notes'}           | ${'My Notes'}                | ${undefined}
  ${'presentation'}     | ${'Presentation'}      | ${'My Presentation'}    | ${'My Presentation'}         | ${undefined}
  ${'videoRecording'}   | ${'Video recording'}   | ${'My Video recording'} | ${'My Video recording'}      | ${undefined}
  ${'meetingMaterials'} | ${'Meeting materials'} | ${meetingMaterials}     | ${meetingMaterials[0].title} | ${[]}
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
        <EventMaterials
          {...createEventResponse()}
          {...{ [type]: presentValue }}
        />,
      );
      expect(getByText(presentExpectedText)).toBeInTheDocument();
    });

    it('is rendered as coming soon when missing', () => {
      const { getByText } = render(
        <EventMaterials
          {...createEventResponse()}
          {...{ [type]: missingValue }}
        />,
      );
      expect(
        getByText(new RegExp(`${typeText}.+coming soon`, 'i')),
      ).toBeInTheDocument();
    });
  },
);
