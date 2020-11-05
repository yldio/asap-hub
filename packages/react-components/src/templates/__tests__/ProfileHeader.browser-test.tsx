import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import domToPlaywright from 'dom-to-playwright';
import { createUserResponse } from '@asap-hub/fixtures';

import { ProfileHeader } from '..';
import { mobileScreen, largeDesktopScreen } from '../../pixels';

afterEach(async () => {
  await jestPlaywright.resetPage();
});

const boilerplateProps: ComponentProps<typeof ProfileHeader> = {
  ...createUserResponse(),
  teams: [],
  aboutHref: './about',
  researchHref: './research',
  outputsHref: './outputs',
};

describe.each([
  ['mobile', mobileScreen],
  ['desktop', largeDesktopScreen],
])('on %s', (_name, screen) => {
  beforeEach(() => {
    page.setViewportSize(screen);
  });

  const getBoundingClientRect = async (selector: string) =>
    page.$eval(selector, (elem: Element) =>
      elem.getBoundingClientRect().toJSON(),
    );

  it('does not re-layout when editable', async () => {
    const { getByRole, rerender } = render(
      <ProfileHeader {...boilerplateProps} />,
    );

    const { select, update } = await domToPlaywright(page, document);
    const viewOnlyHeadingRect = await getBoundingClientRect(
      select(getByRole('heading')),
    );
    const viewOnlyNavRect = await getBoundingClientRect(
      select(getByRole('navigation')),
    );

    rerender(
      <ProfileHeader
        {...boilerplateProps}
        editPersonalInfoHref="#somewhere"
        editContactHref="#somewhere"
      />,
    );
    await update(document);
    const editableHeadingRect = await getBoundingClientRect(
      select(getByRole('heading')),
    );
    const editableNavRect = await getBoundingClientRect(
      select(getByRole('navigation')),
    );

    expect(editableHeadingRect).toEqual(viewOnlyHeadingRect);
    expect(editableNavRect).toEqual(viewOnlyNavRect);
  });
});
