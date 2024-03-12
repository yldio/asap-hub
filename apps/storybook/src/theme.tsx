import { css } from 'emotion';
import { Decorator } from '@storybook/react';
import { themes } from '@asap-hub/react-components';

export const ThemeDecorator: Decorator = (storyFn, context) => {
  return (
    <div className={css(themes['light'])}>{storyFn(context)}</div>
  );
};
