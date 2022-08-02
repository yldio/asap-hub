import { ComponentProps } from 'react';
import { LinkHeadline } from '@asap-hub/react-components';
import { text } from '@storybook/addon-knobs';

export default {
  title: 'Molecules / Link Headline',
};

const props = (): Omit<ComponentProps<typeof LinkHeadline>, 'level'> => ({
  children: text('Text', 'example.com'),
  href: text('href', 'example.com'),
});

export const Display = () => <LinkHeadline level={1} {...props()} />;
export const Headline2 = () => <LinkHeadline level={2} {...props()} />;
export const Headline3 = () => <LinkHeadline level={3} {...props()} />;
export const Headline4 = () => <LinkHeadline level={4} {...props()} />;
export const Headline5 = () => <LinkHeadline level={5} {...props()} />;
export const Headline6 = () => <LinkHeadline level={6} {...props()} />;
