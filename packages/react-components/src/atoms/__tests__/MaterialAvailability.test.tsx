import { render, screen } from '@testing-library/react';

import MaterialAvailability from '../MaterialAvailability';

it.each`
  name             | meetingMaterial           | iconTitle  | message
  ${'available'}   | ${'<div>Available</div>'} | ${'Tick'}  | ${'Notes'}
  ${'coming soon'} | ${undefined}              | ${'Cross'} | ${'Notes coming soon'}
  ${'unavailable'} | ${null}                   | ${'Cross'} | ${'No notes'}
`('renders notes as $name', ({ meetingMaterial, iconTitle, message }) => {
  render(
    <MaterialAvailability
      meetingMaterial={meetingMaterial}
      meetingMaterialType="notes"
    />,
  );
  expect(screen.getByTitle(iconTitle)).toBeInTheDocument();
  expect(screen.getByText(message)).toBeVisible();
});

it.each`
  name                      | meetingMaterialType
  ${'Additional Materials'} | ${'meetingMaterials'}
  ${'Notes'}                | ${'notes'}
  ${'Presentations'}        | ${'presentation'}
  ${'Videos'}               | ${'videoRecording'}
`('renders readable type for $name', ({ name, meetingMaterialType }) => {
  render(
    <MaterialAvailability
      meetingMaterial="exists"
      meetingMaterialType={meetingMaterialType}
    />,
  );
  expect(screen.getByText(name)).toBeVisible();
});
