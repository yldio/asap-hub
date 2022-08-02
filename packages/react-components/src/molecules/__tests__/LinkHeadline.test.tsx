import { render, screen } from '@testing-library/react';
import { ComponentProps } from 'react';
import { largeDesktopScreen } from '../../pixels';
import { viewportCalc } from '../../test-utils';

import LinkHeadline from '../LinkHeadline';

const props: Omit<ComponentProps<typeof LinkHeadline>, 'children' | 'level'> = {
  href: '',
};

describe.each<ComponentProps<typeof LinkHeadline>['level']>([1, 2, 3, 4, 5, 6])(
  'headline level %s',
  (level) => {
    it(`renders the text in an <h${level}>`, () => {
      render(
        <LinkHeadline {...props} level={level}>
          text
        </LinkHeadline>,
      );
      expect(screen.getByRole('heading').tagName).toBe(`H${level}`);
    });
    it(`renders the href`, () => {
      render(
        <LinkHeadline {...props} level={level} href="http://example.com">
          text
        </LinkHeadline>,
      );
      expect(screen.getByRole('link')).toHaveAttribute(
        'href',
        'http://example.com',
      );
    });

    const headingFontSizeVariations = {
      1: '41.5px',
      2: '33.2px',
      3: '26.56px',
      4: '21.25px',
      5: 'default',
      6: 'default',
    };

    it.each<keyof typeof headingFontSizeVariations>([1, 2, 3, 4])(
      'varies the headline fontsize for level %s',
      (styleAsHeading) => {
        render(
          <LinkHeadline
            {...props}
            level={level}
            styleAsHeading={styleAsHeading}
          >
            Example
          </LinkHeadline>,
        );
        const { fontSize } = getComputedStyle(screen.getByRole('heading'));
        expect(viewportCalc(fontSize, largeDesktopScreen)).toEqual(
          headingFontSizeVariations[styleAsHeading],
        );
      },
    );
    it('varies the headline font weight for level 5', () => {
      render(
        <LinkHeadline {...props} level={level} styleAsHeading={5}>
          Example
        </LinkHeadline>,
      );
      const { fontWeight } = getComputedStyle(screen.getByRole('heading'));
      expect(fontWeight).toEqual('bold');
    });
  },
);
