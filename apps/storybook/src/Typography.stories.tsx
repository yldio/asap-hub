import { Fragment } from 'react';
import { select, text, boolean } from '@storybook/addon-knobs';

import {
  Caption as CaptionText,
  Display as DisplayText,
  Headline2 as Headline2Text,
  Headline3 as Headline3Text,
  Headline4 as Headline4Text,
  Headline5 as Headline5Text,
  Headline6 as Headline6Text,
  Paragraph as ParagraphText,
  Title as TitleText,
} from '@asap-hub/react-components';
import { accentColor } from './text';
import { ThemeDecorator } from './theme';

export default {
  title: 'Atoms / Typography',
  decorators: [ThemeDecorator],
};

export const Display = () => (
  <DisplayText>{text('Text', 'Display')}</DisplayText>
);
export const Headline2 = () => (
  <Headline2Text>{text('Text', 'Headline 2')}</Headline2Text>
);
export const Headline3 = () => (
  <Headline3Text>{text('Text', 'Headline 3')}</Headline3Text>
);
export const Headline4 = () => (
  <Headline4Text>{text('Text', 'Headline 4')}</Headline4Text>
);
export const Headline5 = () => (
  <Headline5Text>{text('Text', 'Headline 5')}</Headline5Text>
);
export const Headline6 = () => (
  <Headline6Text>{text('Text', 'Headline 6')}</Headline6Text>
);

export const Paragraph = () => {
  const Importance = boolean('Bold', false) ? 'strong' : Fragment;
  return (
    <ParagraphText primary={boolean('Primary', true)} accent={accentColor()}>
      <Importance>{text('Text', 'Paragraph')}</Importance>
    </ParagraphText>
  );
};
export const Caption = () => {
  const Importance = boolean('Bold', false) ? 'strong' : Fragment;
  return (
    <figure>
      <code>The figure being captioned</code>
      <CaptionText accent={accentColor()}>
        <Importance>{text('Text', 'Caption')}</Importance>
      </CaptionText>
    </figure>
  );
};

export const CaptionAsParagraph = () => (
  <CaptionText asParagraph={true} accent={accentColor()}>
    {text('Text', 'Caption')}
  </CaptionText>
);

export const Title = () => {
  const accent = accentColor();
  const type = select<'link' | 'text'>(
    'Type',
    { Link: 'link', Text: 'text' },
    'text',
  );
  const props =
    type === 'link'
      ? {
          type,
          accent,
          href: text('href', 'https://github.com/yldio/asap-hub'),
          openInNewTab: boolean('openInNewTab', false),
        }
      : { type, accent };

  return (
    <TitleText {...props}>{text('Title', 'Type Your Text Here')}</TitleText>
  );
};
