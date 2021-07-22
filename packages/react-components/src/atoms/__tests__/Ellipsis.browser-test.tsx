import { css } from '@emotion/react';
import { render } from '@testing-library/react';
import domToPlaywright from 'dom-to-playwright';

import { mobileScreen } from '../../pixels';

import Ellipsis from '../Ellipsis';

const lineHeightValue = 12;

const containerStyle = css({
  lineHeight: `${lineHeightValue}px`,
});

const longText =
  'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi commodi fugit impedit numquam temporibus.';

it('When using Ellipsis the element height should be 1 line height even for long texts', async () => {
  await page.setViewportSize(mobileScreen);
  const { container } = render(
    <div css={containerStyle}>
      <Ellipsis>{longText}</Ellipsis>
    </div>,
  );

  const { select } = await domToPlaywright(page, document);
  const containerHeight = await page.$eval(
    select(container),
    ({ offsetHeight }: HTMLElement) => offsetHeight,
  );
  expect(containerHeight).toEqual(lineHeightValue);
});

it('When not using Ellipsis, the component height should be the number of lines needed for the text', async () => {
  await page.setViewportSize(mobileScreen);
  const { container } = render(<span css={containerStyle}>{longText}</span>);
  const { select } = await domToPlaywright(page, document);
  const containerHeight = await page.$eval(
    select(container),
    ({ offsetHeight }: HTMLElement) => offsetHeight,
  );
  expect(containerHeight).toEqual(3 * lineHeightValue);
});
