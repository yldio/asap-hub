import { css } from '@emotion/react';
import { render } from '@testing-library/react';
import domToPlaywright from 'dom-to-playwright';

import { mobileScreen } from '../../pixels';

import Ellipsis from '../Ellipsis';

const LINE_HEIGHT = 12;

const containerStyle = css({
  lineHeight: `${LINE_HEIGHT}px`,
});

const longText =
  'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi commodi fugit impedit numquam temporibus.';

describe('When using Ellipsis', () => {
  it('should have height equals to 1 line height even for long texts', async () => {
    await page.setViewportSize(mobileScreen);
    const { container, rerender } = render(
      <div css={containerStyle}>
        <span>{longText}</span>,
      </div>,
    );
    const { select, update } = await domToPlaywright(page, document);
    let containerHeight = await page.$eval(
      select(container),
      ({ offsetHeight }: HTMLElement) => offsetHeight,
    );
    expect(containerHeight).toBeGreaterThan(LINE_HEIGHT);

    rerender(
      <div css={containerStyle}>
        <Ellipsis>{longText}</Ellipsis>
      </div>,
    );
    update(document);

    containerHeight = await page.$eval(
      select(container),
      ({ offsetHeight }: HTMLElement) => offsetHeight,
    );
    expect(containerHeight).toEqual(LINE_HEIGHT);
  });
  it('should have height equals to 2 lines height for long texts based on props', async () => {
    const NUMBER_OF_LINES = 2;
    await page.setViewportSize(mobileScreen);
    const { container, rerender } = render(
      <div css={containerStyle}>
        <span>{longText}</span>,
      </div>,
    );
    const { select, update } = await domToPlaywright(page, document);
    let containerHeight = await page.$eval(
      select(container),
      ({ offsetHeight }: HTMLElement) => offsetHeight,
    );
    expect(containerHeight).toBeGreaterThan(LINE_HEIGHT);

    rerender(
      <div css={containerStyle}>
        <Ellipsis numberOfLines={NUMBER_OF_LINES}>{longText}</Ellipsis>
      </div>,
    );
    update(document);

    containerHeight = await page.$eval(
      select(container),
      ({ offsetHeight }: HTMLElement) => offsetHeight,
    );
    expect(containerHeight).toEqual(LINE_HEIGHT * NUMBER_OF_LINES);
  });
});
